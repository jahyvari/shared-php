<?php    
    require_once(__DIR__."/classDB.php");
    
    DB::open("mysqli","mysqli",array(
        "host"      => "localhost",
        "username"  => "username",
        "passwd"    => "password",
        "database"  => "test"
    ));
            
    foreach (DB::select("SELECT * FROM test") as $row) {
        var_dump($row);
    }