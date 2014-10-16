<?php
    $glob = glob(__DIR__.DIRECTORY_SEPARATOR."test*.js");
    if (empty($glob)) { # Ei testitiedostoja
        echo "No test files!".PHP_EOL;
        exit(1);
    }
        
    # Suoritetaan kaikki kansion testit
    foreach($glob as $test) {
        $code       = 0;
        $output     = array();
        $basename   = basename($test);
        
        echo "Running $basename".str_repeat(".",40-strlen($basename))." ";
        $result = shell_exec("node $test");
        
        # Jotain palautui -> virhe
        if ($result != "") {
            echo $result.PHP_EOL;
            exit(1);
        }
        
        echo "OK!".PHP_EOL;
    }