<?php
	$text = @$_GET['text'];
	if (is_numeric($text)) {
		return;
	}

	$json = json_decode(@file_get_contents('translation.json') ?: '{}', true);

	$md5 = md5($text);
	$json[$md5] = [
		'md5' => md5($text),
		'text' => $text,
		'timestamp' => gmdate("Y-m-d\TH:i:s\Z"),
	];

	function cmp($a, $b) {
		return $a['timestamp'] < $b['timestamp'] ? -1 : $a['timestamp'] > $b['timestamp'] ? 1
			: $a['text'] < $b['text'] ? -1 : $a['text'] > $b['test'] ?
			: 0;
	}

	uasort($json, cmp);

	file_put_contents('translation.json', json_encode($json, JSON_PRETTY_PRINT));
?>
