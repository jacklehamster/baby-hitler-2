<?php

function fit_images(&$image_infos, $sheet, $sheet_path, $rect_x, $rect_y, $rect_width, $rect_height,
		$image_keys_sorted_by_width, $image_keys_sorted_by_height, $height_first) {
	$count = 0;
	$keys = $height_first ? $image_keys_sorted_by_height : $image_keys_sorted_by_width;

	foreach ($keys as $key) {
		$image_info = &$image_infos[$key];
		if (!$image_info['sheet_path']) {
			$width = $image_info['width'];
			$height = $image_info['height'];
			if ($width <= $rect_width && $height <= $rect_height) {
				$sprite_path = $image_info['path'];
				$sprite = imagecreatefrompng($sprite_path);
				imagealphablending($sprite, true);
				imagecopy($sheet, $sprite, $rect_x, $rect_y, 0, 0, $width, $height);
				imagedestroy($sprite);

				$filename = basename($sheet_path);
				$image_info['sheet_path'] = $sheet_path;
				$image_info['sheet_x'] = $rect_x;
				$image_info['sheet_y'] = $rect_y;
				$image_info['smart_path'] = "generated/spritesheets/$filename|crop:$rect_x,$rect_y,$width,$height";
				$count++;

				if (error_get_last()) {
					header('Content-type: text/plain');
					var_dump(error_get_last());
					exit();
					break;
				}

				if ($height_first) {
					$count += fit_images($image_infos, $sheet, $sheet_path,
						$rect_x,
						$rect_y + $height,
						$rect_width,
						$rect_height - $height,
						$image_keys_sorted_by_width,
						$image_keys_sorted_by_height,
						false
					);

					$count += fit_images($image_infos, $sheet, $sheet_path,
						$rect_x + $width,
						$rect_y,
						$rect_width - $width,
						$height,
						$image_keys_sorted_by_width,
						$image_keys_sorted_by_height,
						true
					);
				} else {
					$count += fit_images($image_infos, $sheet, $sheet_path,
						$rect_x + $width,
						$rect_y,
						$rect_width - $width,
						$rect_height,
						$image_keys_sorted_by_width,
						$image_keys_sorted_by_height,
						true
					);

					$count += fit_images($image_infos, $sheet, $sheet_path,
						$rect_x,
						$rect_y + $height,
						$width,
						$rect_height - $height,
						$image_keys_sorted_by_width,
						$image_keys_sorted_by_height,
						false
					);

				}
				break;
			}
		}
	}
	return $count;
}

function get_images_from_directory($dir, $except) {
	  $image_paths = [];
      $assets = scandir($dir);
      foreach ($assets as $file) {
        $filename = "$dir/$file";
        if (is_file($filename) && @exif_imagetype($filename)) {
        	$image_paths[] = $filename;
        }
      }

	  if ($except) {
		$image_paths = array_filter($image_paths, function($filename) use ($except) {
			foreach ($except as $exception) {
				if (strpos($filename, $exception) !== false) {
					return false;
				}
			}
			return true;
		});
	  }      
      return $image_paths;
}

function generate_spritesheets($images, $size, $output_path) {
	list($sheet_width, $sheet_height) = $size;

	$image_infos = [];
	$image_keys_sorted_by_width = $images;
	$image_keys_sorted_by_height = $images;

	foreach ($images as $img_path) {
		list ($width, $height) = getimagesize($img_path);
		if ($width > $sheet_width || $height > $sheet_height) {
			throw new Exception("Size of $img_path is {$width}x{$height}. Max size is {$sheet_width}x{$sheet_height}.");
		}
		$image_infos[$img_path] = [
			'width' => $width,
			'height' => $height,
			'path' => $img_path,
			'sheet_path' => null,
			'sheet_x' => null,
			'sheet_y' => null,
			'smart_path' => null,
		];
	}
	usort($image_keys_sorted_by_height, function($a, $b) use ($image_infos) {
		return $image_infos[$b]['height'] - $image_infos[$a]['height'];
	});
	usort($image_keys_sorted_by_width, function($a, $b) use ($image_infos) {
		return $image_infos[$b]['width'] - $image_infos[$a]['width'];
	});

	$images_count = count($images);
	$sheets = [];
	while ($images_count > 0) {
		//	create sheet
		$sheet = imagecreatetruecolor($sheet_width, $sheet_height);
		$white = imagecolorallocatealpha($sheet, 255, 255, 255, 127);
		imagefill($sheet, 0, 0, $white);

		$sheet_index = count($sheets);

		imagealphablending($sheet, false);
		imagesavealpha($sheet, true);
		$count = fit_images($image_infos, $sheet, $output_path ? "$output_path/sheet$sheet_index.png" : $sheet_index,
			0, 0, $sheet_width, $sheet_height,
			$image_keys_sorted_by_width,
			$image_keys_sorted_by_height,
			$sheet_width > $sheet_height
		);
		$images_count -= $count;
		$sheets[] = $sheet;
	}

	return [
		$sheets,
		$image_infos,
	];
}

function process_spritesheets ($dir, $image_paths, $size, $output_path, $except, $generate_html=false) {
	if($image_paths || $dir) {
		if ($except) {
			$except = explode(',', $except);
		}

		if (!$image_paths) {
			$image_paths = get_images_from_directory($dir, $except);
		} else {
			$image_paths = explode(',', $image_paths);
			if ($except) {
				$image_paths = array_filter($image_paths, function($filename) use ($except) {
					foreach ($except as $exception) {
						if (strpos($filename, $exception) !== false) {
							return false;
						}
					}
					return true;
				});
			}
		}

		list($sheets, $image_infos) = generate_spritesheets($image_paths, $size ? explode('x', $size) : [ 1024, 1024 ], $output_path ?: null);
		if (error_get_last()) {
			var_dump(error_get_last());
			return;
		}

		if (!$output_path) {
			header('Content-Type: image/png');
			imagepng($sheets[0]);
		} else {
			$html = "";

			//	cleanup
			$files = glob("$output_path/*"); // get all file names
			foreach($files as $file){ // iterate files
			  if(is_file($file))
			    unlink($file); // delete file
			}

			$html .= "<div>\n";

			foreach($sheets as $index => $sheet) {
				$sheet_path = "$output_path/sheet$index.png";
				imagepng($sheet, $sheet_path);
				$html .= "<img style='width: 200px; height: 200px; margin: 5px; border: 1px solid black; background-color: #FAFAFF;' src='/$sheet_path'>\n";
			}
			$html .=  "</div>\n";

			$sheet_json = [];
			foreach($image_infos as $path => $info) {
				$sheet_json[$path] = $info['smart_path'];
			}

			$json = json_encode($sheet_json, JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);
			file_put_contents("$output_path/spritesheet.js", "const spritesheet = $json;");
			$html .=  "<a href='/$output_path/spritesheet.js'>spritesheet.js</a><br>\n";
			$html .=  "<div style='white-space: pre; font-family: Courier New, monospace;'>$json</div>\n";
			
			if ($generate_html) {
				header('Content-type: text/html');
				echo $html;
			}
		}


		foreach($sheets as $index => $sheet) {
			imagedestroy($sheet);
		}
	}
}

/*
game-thumbnail.png
baby-hitler-photo.png
congrats.png
*/

$dir = $_GET['dir'] ?? null;
$image_paths = $_GET['images'] ?? null;
$size = $_GET['size'] ?? null;
$output_path = $_GET['output'] ?? null;
$except = $_GET['except'] ?? null;

process_spritesheets($dir, $image_paths, $size, $output_path, $except, true);
