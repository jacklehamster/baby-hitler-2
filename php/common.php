<?php
function console_log($msg) {
  echo "<script>console.log(`$msg`);</script>";
}

function quote($string) {
  return "'$string'";
}

function prepare_dir($dir, $var, $output_file, $lambda=null) {
  $files = [];
  $assets = scandir($dir);
  $asset_source = "";
  $asset_source .= "const $var = {\n";
  foreach ($assets as $file) {
    $filepath = "$dir/$file";
    if (is_file($filepath)) {
      if(!$lambda || $lambda($filepath)){
        $files[] = $filepath;
        $size = filesize($filepath);
        $date = filemtime($filepath);
        $asset_source .= <<<EOD
'$file' : {
  size: $size,
  date: '$date',
},

EOD;
      }
    }
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