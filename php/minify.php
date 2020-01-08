<?php
    include "minify/Minify.php";
    include "minify/JS.php";
    use MatthiasMullie\Minify;

    function minify($path) {
		$minifier = new Minify\JS($path);
		$explode = explode('.', $path);
		array_pop($explode);
		$explode[] = "min.js";
		$minifiedPath = "generated/" . implode('.', $explode);
		$minifier->minify($minifiedPath);
		return $minifiedPath;    	
    }

	$sourcePath = $_GET['input'];
	if ($sourcePath) {
		header('Content-Type: text/plain; charset=utf-8');

		echo minify($sourcePath);
	}
?>