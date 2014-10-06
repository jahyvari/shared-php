<?php
    class PublicClass extends APIBase {
        /**
         * Julkisessa luokassa kaikki funktiot ovat kutsuttavissa.
         */
        public static function isCallable($function) {
            return true;
        }
        
        public static function getFunctionList() {
            $result = array();
            
            $glob = glob(__DIR__."/class*.php");
            foreach ($glob as $filename) {
                $class = mb_substr(basename($filename),5,-4);
                
                $methods = array();
                $list = get_class_methods($class);
                
                if (!empty($list)) {
                    foreach ($list as $method) {
                        if (Login::checkAccess($class,$method)) {
                            $methods[] = $method;
                        }
                    }
                }
                
                if (!empty($methods)) {
                    $result[$class] = $methods;
                }
            }
            
            return $result;
        }
    }