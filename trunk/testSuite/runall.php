<?php
    $glob = glob(__DIR__.DIRECTORY_SEPARATOR."test*.php");
    if (empty($glob)) { # Ei testitiedostoja
        echo "No test files!\n";
        exit(1);
    }
    
    # Suoritetaan kaikki kansion testit
    foreach($glob as $test) {
        $code       = 0;
        $output     = array();
        $basename   = basename($test);
        
        echo "Running $basename".str_repeat(".",40-strlen($basename))." ";
        exec("php $test",$output,$code);
        
        # Jotain palautui ruudulle   
        if (!empty($output)) {
            echo rtrim(implode(PHP_EOL,$output)).PHP_EOL;
        }
                
        # Virhe
        if ($code > 0) {
            echo "FAILED!".PHP_EOL;
            exit($code);
        }
        
        echo "OK!".PHP_EOL;
    }