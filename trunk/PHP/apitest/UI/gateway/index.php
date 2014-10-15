<?php
    session_start();
    header("Content-Type: application/json");
    
    require_once(dirname(__DIR__).
        DIRECTORY_SEPARATOR.
        "inc".
        DIRECTORY_SEPARATOR.
        "incFunctions.php"
    );
    
    $class      = null;
    $function   = null;    
    $parts      = explode("/",$_SERVER["REQUEST_URI"]);
    $count      = count($parts);
    
    # Haetaan class ja function
    if ($count >= 2) {
        $class      = $parts[$count-2];
        $function   = $parts[$count-1];
    }
    
    # Haetaan kutsun data    
    $data = array();
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $input = file_get_contents("php://input");
        if ($input) {
            $data = json_decode($input,true);
        }
    }
    
    echo json_encode(apiCall($class,$function,$data));