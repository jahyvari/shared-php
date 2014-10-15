<?php
    header("Content-Type: application/json");
    
    require(__DIR__.
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
        
    # Löytyykö sessionid header    
    if (isset($_SERVER["HTTP_X_SESSIONID"])) {
        Login::set("sessionid",$_SERVER["HTTP_X_SESSIONID"]);
    }
        
    # Haetaan kutsun data    
    $data = array();
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $input = file_get_contents("php://input");
        if ($input) {
            $data = json_decode($input,true);
        }
    }
        
    # Prosessoi kutsu
    echo json_encode(RequestHandler::process($class,$function,$data));