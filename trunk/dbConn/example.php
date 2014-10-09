<?php    
    error_reporting(E_ALL);
    ini_set("display_errors", "1");

    require_once(__DIR__.DIRECTORY_SEPARATOR."classDB.php");
        
    # Yhteysasetukset löytyvät ~/.dbconn tiedostosta
    DB::open("conn1");
            
    foreach (DB::select("SELECT * FROM test") as $row) {
        var_dump($row);
    }