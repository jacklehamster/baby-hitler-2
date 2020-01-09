<?php
  header('Set-Cookie: cross-site-cookie=name; SameSite=None; Secure');

    function prepare_dir($dir, $var, $output_file, $lambda=null) {
      $assets = scandir($dir);
      $asset_source = "";
      $asset_source .= "const $var = {\n";
      foreach ($assets as $file) {
        $filename = "$dir/$file";
        if (is_file($filename)) {
          if(!$lambda || $lambda($filename)){
            $size = filesize("$dir/$file");
            $asset_source .= <<<EOD
   '$file' : {
      size: $size,
   },

EOD;
          }
        }
      }
      $asset_source .= "};";

      file_put_contents("generated/$output_file", $asset_source);      
    }


    /**
      * PREPARE ASSETS.
      */
    prepare_dir('assets', 'FILE_SIZE', 'asset-size.js', function($filename) {
      return @exif_imagetype($filename);
    });
    /**
      * PREPARE CONFIGS.
      */
    prepare_dir('config', 'CONFIG_FILES', 'config-size.js');


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
    minify("game.js");
    minify("config.js");


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