<?php
	$text = @$_GET['text'];
	if (is_numeric($text)) {
		return;
	}

	chdir("..");
	$json = json_decode(@file_get_contents('translation.json', LOCK_EX) ?: '{}', true);

	$md5 = md5($text);
	$json[$md5] = [
		'md5' => md5($text),
		'text' => $text,
		'timestamp' => gmdate("Y-m-d\TH:i:s\Z"),
	];

	function cmp($a, $b) {
		$timestamp_a = $a['timestamp'] ?? "";
		$timestamp_b = $b['timestamp'] ?? "";
		$tmpcomp = $timestamp_a < $timestamp_b ? -1
			: ($timestamp_a > $timestamp_b ? 1 : 0);
		if ($tmpcomp) {
			return $tmpcomp;
		}
		return $a['text'] < $b['text'] ? -1 : ($a['text'] > $b['text'] ? 1 : 0);
	}

	uasort($json, "cmp");

	file_put_contents('translation.json', json_encode($json, JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES, LOCK_EX)) or die("can't open file");;
	echo "OK";
?>
