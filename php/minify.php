<?php
    include "minify/Minify.php";
    include "minify/JS.php";
    use MatthiasMullie\Minify;

    function minify($paths, $target_file) {
		$minifier = new Minify\JS(...$paths);
		$minifiedPath = "generated/$target_file";
		$minifier->minify($minifiedPath);
		return $minifiedPath;    	
    }

	$sourcePath = $_GET['input'];
	if ($sourcePath) {
		header('Content-Type: text/plain; charset=utf-8');

		echo minify($sourcePath);
	}
?>