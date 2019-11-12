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
	];

	file_put_contents('translation.json', json_encode($json, JSON_PRETTY_PRINT), LOCK_EX);
?>
