<?php

function mergeImages($image1, $image2) {
	/* Get images dimensions */
	list($width1, $height1) = getimagesize($image1);
	list($width2, $height2) = getimagesize($image2);

	/* Load the two existing images */
	$im1 = imagecreatefrompng($image1);
	$im2 = imagecreatefrompng($image2);
	imagealphablending($im1, true);
	imagealphablending($im2, true);

	if ($width1 + $width2 < $height1 + $height2) {
		/* Create the new image, width is combined but height is the max height of either image */
		$im = imagecreatetruecolor($width1 + $width2, max($height1, $height2));
		$white = imagecolorallocatealpha($im, 255, 255, 255, 127);
		imagefill($im, 0, 0, $white);

		imagealphablending($im, false);
		imagesavealpha($im, true);

		/* Merge the two images into the new one */
		imagecopy($im, $im1, 0, 0, 0, 0, $width1, $height1);
		imagecopy($im, $im2, $width1, 0, 0, 0, $width2, $height2);
	} else {
		$im = imagecreatetruecolor(max($width1, $width2), $height1 + $height2);
		$white = imagecolorallocatealpha($im, 255, 255, 255, 127);
		imagefill($im, 0, 0, $white);

		imagealphablending($im, false);
		imagesavealpha($im, true);

		/* Merge the two images into the new one */
		imagecopy($im, $im1, 0, 0, 0, 0, $width1, $height1);
		imagecopy($im, $im2, 0, $height1, 0, 0, $width2, $height2);
	}

	return $im;
}

/* Two images */
$image1 = $_GET['img1'];
$image2 = $_GET['img2'];
$output = $_GET['output'];
if($image1 && $image2) {
	header('Content-Type: image/png');
	$im = mergeImages($image1, $image2);
	if ($output) {
		imagepng($im, $output);
	}
	imagepng($im);
	imagedestroy($im);
}