<?php

function fit_images(&$image_info, $sheet, $sheet_path, $rect_x, $rect_y, $rect_width, $rect_height) {
	$count = 0;
	foreach($image_infos as &$image_info) {
		if (!$image_info['sheet_path']) {
			$width = $image_info['width'];
			$height = $image_info['height'];
			if ($width <= $rect_width && $height <= $rect_height) {
				$sprite_path = $image_info['path'];
				$sprite = imagecreatefrompng($sprite_path);
				imagealphablending($image, true);
				imagecopy($sheet, $image, $sheet_x, $sheet_y, 0, 0, $width, $height);
				imagedestroy($image);

				$image_info['sheet_path'] = $sheet_path;
				$image_info['sheet_x'] = $rect_x;
				$image_info['sheet_y'] = $rect_y;
				$count++;

				$count += fit_images($image_info, $sheet, $sheet_path,
					$rect_x + $width,
					$rect_y,
					$rect_width - $width,
					$height);

				$count += fit_images($image_info, $sheet, $sheet_path,
					$rect_x,
					$rect_y + $height,
					$rect_width,
					$rect_height - $height);
				break;
			}
		}
	}
	return $count;
}

function generate_spritesheets($images, $size, $output_path) {
	list($sheet_width, $sheet_height) = $size;
	$sheets = [];

	$image_infos = array_map(function($img_path) {
		list ($width, $height) = getimagesize($img_path);
		return [
			'width' => $width,
			'height' => $height,
			'path' => $img_path,
			'sheet_path' => null,
			'sheet_x' => null,
			'sheet_y' => null,
		];
	}, $images);
	usort($image_infos, function($a, $b) {
		return $b['height'] - $a['height'];
	});

	$sheet_index = 0;
	$sheet_x = 0;
	$sheet_y = 0;
	$next_y = 0;
	foreach($image_infos as &$image_info) {
		$width = $image_info['width'];
		$height = $image_info['height'];
		if ($width > $sheet_width || $height > $sheet_height) {
			continue;
		}
		if ($sheet_x + $width > $sheet_width) {
			$sheet_x = 0;
			$sheet_y = $next_y;
		}
		if ($sheet_y + $height > $sheet_height) {
			$sheet_x = 0;
			$sheet_y = 0;
			$next_y = 0;
			$sheet_index++;
		}

		if ($sheet_index >= count($sheets)) {
			$sheet = imagecreatetruecolor($sheet_width, $sheet_height);
			$white = imagecolorallocatealpha($sheet, 255, 255, 255, 127);
			imagefill($sheet, 0, 0, $white);

			imagealphablending($sheet, false);
			imagesavealpha($sheet, true);
			$sheets[] = $sheet;
		}

		$sheet = $sheets[$sheet_index];

		$img_path = $image_info['path'];
		$image_info['sheet_path'] = $output_path ? "$output_path/sheet$sheet_index.png" : $sheet_index;
		$image_info['sheet_x'] = $sheet_x;
		$image_info['sheet_y'] = $sheet_y;

		$image = imagecreatefrompng($img_path);
		imagealphablending($image, true);
		imagecopy($sheet, $image, $sheet_x, $sheet_y, 0, 0, $width, $height);
		imagedestroy($image);
		$sheet_x += $width;
		$next_y = max($next_y, $sheet_y + $height);
	}

	return [$sheets, $image_infos];
}

$image_paths = $_GET['images'];
$size = $_GET['size'] ?? null;
$output_path = $_GET['output'] ?? null;
if($image_paths) {
	list($sheets, $image_infos) = generate_spritesheets(explode(',', $image_paths), $size ? explode('x', $size) : [ 1024, 1024 ], $output_path ?: null);
	if (error_get_last()) {
		var_dump(error_get_last());
		return;
	}

	if (!$output_path) {
		header('Content-Type: image/png');
		imagepng($sheets[0]);
	} else {
		header('Content-type: text/html');
		foreach($sheets as $index => $sheet) {
			$sheet_path = "$output_path/sheet$index.png";
			imagepng($sheet, $sheet_path);
			echo "<div style='margin: 5px'><img src='$sheet_path'></div>";
		}
		$json = json_encode(
			$image_infos,
			JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);
		file_put_contents("$output_path/spritesheet.json", $json);
		file_put_contents("$output_path/spritesheet.js", "const spritesheet = $json;");
		echo "<a href='$output_path/spritesheet.json'>spritesheet.json</a><br>";
		echo "<a href='$output_path/spritesheet.js'>spritesheet.js</a><br>";
		echo "<div style='white-space: pre; font-family: Courier New, monospace;'>$json</div>";
	}


	foreach($sheets as $index => $sheet) {
		imagedestroy($sheet);
	}
}