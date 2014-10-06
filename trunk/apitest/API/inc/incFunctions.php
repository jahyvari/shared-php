<?php    
    # Autoload hakee luokkia class - kansiosta    
    spl_autoload_register(function($class) {
        $filename = dirname(__DIR__).
            DIRECTORY_SEPARATOR.
            "class".
            DIRECTORY_SEPARATOR.
            "class".$class.".php";
        
        if (file_exists($filename)) { # Luokka löytyy
            require($filename);
        }
    });