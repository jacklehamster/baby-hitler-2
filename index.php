<?php
  header('Set-Cookie: cross-site-cookie=name; SameSite=None; Secure');

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

    $asset_size_file = "generated/asset-size.js";
    $previous_asset_size_js = file_exists($asset_size_file) ? file_get_contents($asset_size_file) : "";

    /**
      * PREPARE ASSETS.
      */
    $asset_files = prepare_dir('assets', 'FILE_SIZE', 'asset-size.js', function($filepath) {
      return @exif_imagetype($filepath);
    });
    /**
      * PREPARE CONFIGS.
      */
    $config_files = prepare_dir('config', 'CONFIG_FILES', 'config-size.js');
    $config_Files = array_filter($config_files, function($file) { return $file != "config/load-screen.js"; });

    if ($previous_asset_size_js != file_get_contents($asset_size_file) || !file_exists("generated/spritesheets/spritesheet.js")) {
      console_log("Redoing assets for spritesheet");
      //  create spritesheets
      include "php/spritesheet.php";
      $except = "game-thumbnail,baby-hitler-photo,congrats,alphabet,brave-shield";
      process_spritesheets("assets", null, "1024x1024", "generated/spritesheets", $except);
    }

    //  SET debug mode
    if (!isset($_GET['nodebug'])) {
      ?>
        <script>
          window.debugMode = true;
          window.updateTranslationLink = "/php/updatetranslation.php?text=";
        </script>
      <?php
    }

    //  minify JS
    include "php/minify.php";

    $base_files = [
      "base/error-div.js",
      "base/common.js",
      "base/game.js",
      "base/config.js",
      "generated/config-size.js",
      "generated/spritesheets/spritesheet.js",
      "config/load-screen.js",
      "base/translation.js",
      "base/starter.js",
    ];

    minify($base_files, 'game-engine.min.js');
    minify($config_files, 'config-files.min.js');

    //  generated index.js
    $base_files_js = implode(",", array_map(function($file) {
      return "'$file'";
    }, $base_files));

    $config_files_js = implode(",", array_map(function($file) {
      return "'$file'";
    }, $config_files));

    $index_js = <<<EOD
const JAVASCRIPT_FILES = window.debugMode ? [ $base_files_js ] : [ "generated/game-engine.min.js" ];
JAVASCRIPT_FILES.forEach(file => {
  document.write(`<script src="\${file}"><\/script>`);
});


const CONFIG_FILES_TO_LOAD = window.debugMode ? [ $config_files_js ] : [ "generated/config-files.min.js" ];

CONFIG_FILES_TO_LOAD.forEach(file => {
  document.write(`<script src="\${file}" async><\/script>`);
});

EOD;
    file_put_contents("generated/idx.js", $index_js);

    /**
     *  SHOW GAME
     */
    readfile("index.html");

    /**
     *  ZIP GAME
     */
    function startsWith ($string, $startString) { 
        $len = strlen($startString); 
        return (substr($string, 0, $len) === $startString); 
    } 

    function zipAll($zipFilename) {
      // Get real path for our folder
      $rootPath = realpath('.');

      // Initialize archive object
      $zip = new ZipArchive();
      $zip->open($zipFilename, ZipArchive::CREATE | ZipArchive::OVERWRITE);

      // Create recursive directory iterator
      /** @var SplFileInfo[] $files */
      $files = new RecursiveIteratorIterator(
          new RecursiveDirectoryIterator($rootPath),
          RecursiveIteratorIterator::LEAVES_ONLY
      );

      foreach ($files as $name => $file)
      {
          // Skip directories (they would be added automatically)
          if (!$file->isDir())
          {
              // Get real and relative path for current file
              $filePath = $file->getRealPath();
              $relativePath = substr($filePath, strlen($rootPath) + 1);

              switch ($file->getExtension()) {
                case "php":
                case "sh":
                case "DS_Store":
                case "gdoc":
                case "zip":
                case "txt":
                case "md":
                  break;
                default:
                  if (!startsWith($relativePath, '.git')) {
                    // Add current file to archive
                    $zip->addFile($filePath, $relativePath);
                  }
                  break;
              }

          }
      }

      // Zip archive will be created only after closing object
      $zip->close();  
  }
  $zipFilename = 'baby-hitler-2.zip';
  zipAll($zipFilename);
  $md5 = md5_file($zipFilename);
  file_put_contents('zip_version.txt', "$md5\n");

?>