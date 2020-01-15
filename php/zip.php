<?php
require_once "common.php";

function zip_files($files, $zipFilename) {
    $zip = new ZipArchive();
    $zip->open($zipFilename, ZipArchive::CREATE | ZipArchive::OVERWRITE);
    foreach ($files as $file) {
      $zip->addFile($file);
    }
    $zip->close();
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
?>