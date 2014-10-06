<?php
    class Login {
        private static $_data = array(
            "sessionid" => null # Session id
        );
        
        public static function get($name) {
            if (!array_key_exists($name,self::$_data)) {
                throw new Exception("Invalid key $name");
            }
            return self::$_data[$name];
        }
        
        public static function set($name,$value) {
            if (!array_key_exists($name,self::$_data)) {
                throw new Exception("Invalid key $name");
            }
            self::$_data[$name] = $value;
        }
        
        /**
         * Funktio kertoo onko käyttäjällä oikeutta kutsuun.
         *
         * @param   string  $class      Kutsuttava luokka
         * @param   string  $function   Kutsuttava funktio
         * @return  bool
         */
        public static function checkAccess($class,$function) {
            $result = false;
            
            # Tuntematon funktio
            if (!method_exists($class,$function)) {
                return $result;
            }
            
            # Tarkastetaan onko funktio yläpäätään API:n kautta kutsuttava
            $isCallable = "isCallable";
            if ($function != $isCallable) {
                if (method_exists($class,$isCallable)) {
                    $result = $class::$isCallable($function);
                }
            }
            
            return $result;
        }
    }