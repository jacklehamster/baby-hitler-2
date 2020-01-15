<?php
    header('Set-Cookie: cross-site-cookie=name; SameSite=None; Secure');

    const MAX_FILES_PER_CONFIG = 60;
    const SPRITESHEET_DIMENSION = '1500x1500';

    require_once "php/common.php";
    require_once "php/minify.php";
    require_once "php/zip.php";

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
    $config_files = prepare_dir('config', 'CONFIG_FILES', 'config-size.js', function($filepath) {
      return pathinfo($filepath)['extension'] === 'js';
    });
    $config_Files = array_filter($config_files, function($file) { return $file != "config/load-screen.js"; });

    if ($previous_asset_size_js != file_get_contents($asset_size_file) || !file_exists("generated/spritesheets/spritesheet.js")) {
      console_log("Redoing assets for spritesheet");
      //  create spritesheets
      include "php/spritesheet.php";
      $except = "game-thumbnail,baby-hitler-photo,congrats,alphabet,scanline,brave-shield";
      process_spritesheets("assets", null, SPRITESHEET_DIMENSION, "generated/spritesheets", $except);
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

    $combined_configs = [];
    $config_group = [];
    foreach ($config_files as $file) {
      $config_group[] = $file;
      if (count($config_group) >= MAX_FILES_PER_CONFIG) {
        $index = count($combined_configs);
        $config_name = "config/config-files-{$index}.min.js";
        $combined_configs[] = "generated/$config_name";
        minify($config_group, $config_name);
        $config_group = [];
      }
    }

    if (count ($config_group) > 0) {
      $index = count($combined_configs);
      $config_name = "config/config-files-{$index}.min.js";
      $combined_configs[] = "generated/$config_name";
      minify($config_group, $config_name);
      $config_group = [];
    }

    //  generate idx.js
    $base_files_js = implode(",", array_map("quote", $base_files));

    $config_files_js = implode(",", array_map("quote", $config_files));
    $combined_config_files_js = implode(",", array_map("quote", $combined_configs));

    $index_js = <<<EOD
const JAVASCRIPT_FILES = window.debugMode ? [ $base_files_js ] : [ "generated/game-engine.min.js" ];
JAVASCRIPT_FILES.forEach(file => {
  document.write(`<script src="\${file}"><\/script>`);
});

const CONFIG_FILES_TO_LOAD = window.debugMode ? [ $config_files_js ] : [ $combined_config_files_js ];
CONFIG_FILES_TO_LOAD.forEach(file => {
  document.write(`<script src="\${file}" async><\/script>`);
});

EOD;
    file_put_contents("generated/idx.js", $index_js);

    /**
     *  List all offline files
     */
    $offline_files = collect_files("generated", true, function($filepath) {
      return @exif_imagetype($filepath) || pathinfo($filepath)['extension'] === 'js';     
    });

    $offline_files = array_merge($offline_files, collect_files("sounds", true, function($filepath) {
      return pathinfo($filepath)['extension'] === 'mp3';     
    }));
    $offline_files[] = "assets/alphabet.png";
    $offline_files[] = "assets/scanline.png";
    $offline_files[] = "service-worker.js";
    $offline_files[] = "game.css";
    $offline_files[] = "index.html";
    $offline_files[] = "manifest.json";
    $offline_files[] = "translation.json";
    $offline_files[] = "offline.html";
    $offline_json = json_encode($offline_files, JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);
    file_put_contents("offline_files.js", "const OFFLINE_FILES = $offline_json");


    /**
     *  SHOW GAME
     */
    readfile("index.html");

    /**
     *  ZIP GAME
     */
    $zipFilename = 'baby-hitler-2.zip';
    zip_files($offline_files, $zipFilename);
    $md5 = md5_file($zipFilename);
    file_put_contents('zip_version.txt', "$md5\n");
?>