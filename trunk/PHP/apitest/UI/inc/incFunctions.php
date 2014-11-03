<?php    
    # Polku rajapintaan
    $__API_URL = "http://{$_SERVER["HTTP_HOST"]}";
    foreach (explode("/",$_SERVER["REQUEST_URI"]) as $part) {
        if ($part == "UI") {
            break;
        }
        if ($part) {
            $__API_URL .= "/".$part;
        }
    }
    $__API_URL .= "/API/request";
    
    /**
     * Funktio lähettää kutsun sovelluksen rajapintaan.
     *
     * @param   string  $class      Kutsuttava luokka
     * @param   string  $function   Kutsuttava funktio
     * @param   array   $data       Data kutsuun (vapaaehtoinen)
     * @return  array
     */
    function apiCall($class,$function,$data = array()) {        
        global $__API_URL;
        
        $result = array();
        
        # Luodaan URL
        $url = $__API_URL.
            "/".
            $class.
            "/".
            $function;
                
        
        # Kutsun data
        $dataStr = "";
        if (is_array($data)) {
            $dataStr = json_encode($data);
        }
        
        # Luodaan HTTP optiot
        $opts = array(
            "http" => array(                
                "content"   => $dataStr,
                "header"    => "Content-type: application/json",
                "method"    => "POST"
            )            
        );
        
        # Lisätään sessionid mukaan kutsuun
        if (isset($_SESSION["sessionid"])) {
            $opts["http"]["header"] .= "\nx-sessionid: ".
                $_SESSION["sessionid"];
        }
        
        $context = stream_context_create($opts);
        
        # Kutsu rajapintaa
        $return = file_get_contents($url,false,$context);
        if ($return) {
            $result = json_decode($return,true);
            if (!is_array($result)) {
                $result = array();
            }
        }
        
        return $result;
    }