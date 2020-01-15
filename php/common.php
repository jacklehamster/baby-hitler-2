<?php
function console_log($msg) {
  echo "<script>console.log(`$msg`);</script>";
}

function quote($string) {
  return "'$string'";
}

function collect_files($dir, $recursive, $lambda = null) {
  $result = [];
  $files = scandir($dir);
  foreach ($files as $file) {
    $path = "$dir/$file";
    if (is_file($path)) {
      if(!$lambda || $lambda($path)) {
        $result[] = $path;
      }
    } else if ($recursive && $file !== '.' && $file !== '..') {
      $result = array_merge($result, collect_files($path, $recursive, $lambda));
    }
  }
  return $result;
}

function prepare_dir($dir, $var, $output_file, $lambda=null) {
  $files = [];
  $assets = collect_files($dir, true, $lambda);

  $asset_source = "";
  $asset_source .= "const $var = {\n";
  foreach ($assets as $filepath) {
    $files[] = $filepath;
    $filename = basename($filepath);
    $size = filesize($filepath);
    $md5 = md5_file($filepath);
    $asset_source .=
<<<EOD
'$filename' : {
  size: $size,
  md5: '$md5',
},

EOD;
  }
  $asset_source .= "};";

  file_put_contents("generated/$output_file", $asset_source);
  return $files;
}

function startsWith ($string, $startString) { 
    $len = strlen($startString); 
    return (substr($string, 0, $len) === $startString); 
} 
?>