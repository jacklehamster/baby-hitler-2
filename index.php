<?php

    /**
      * PREPARE ASSETS.
      */
    $dir    = 'ASSETS';
    $assets = scandir($dir);
    $asset_source = "";
    $asset_source .= "const FILE_SIZE = {\n";
    foreach ($assets as $file) {
      $filename = "$dir/$file";
    	if (is_file($filename)) {
        if(@exif_imagetype($filename)){
          $size = filesize("$dir/$file");
          $asset_source .= "   '$file' : $size,\n";
        }
    	}
    }
    $asset_source .= "};";

    file_put_contents("asset-size.js", $asset_source);

    ?>
      <script>
        window.debugMode = true;
      </script>
    <?php


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