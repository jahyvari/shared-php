<?php
    class Modulo {
        /**
         * Tarkastaa arvon modulo 31 laskennan.
         *
         * @param   string  $val    Tarkastettava arvo
         * @return  bool
         */
        public static function checkModulo31($val) {
            $result = false;
            
            if (mb_ereg_match("^[0-9]{1,}[0-9A-FHJ-NPR-Y]{1}$",$val)) {
                $digits = array_merge(
                    range(0,9),
                    range("A","F"),
                    array("H"),
                    range("J","N"),
                    array("P"),
                    range("R","Y")
                );
                
                $num = (int)mb_substr($val,0,-1);
                
                if ($num > 0) {
                    $check = $num%31;                    
                    if (isset($digits[$check])) {
                        if (mb_substr($val,-1) == $digits[$check]) {
                            $result = true;
                        }
                    }
                }
            }
            
            return $result;
        }
        
        /**
         * Tarkastaa arvon modulo 97-10 laskennan.
         *
         * @param   string  $val    Tarkastettava arvo
         * @return  bool
         */
        public static function checkModulo97_10($val) {
            $result = false;
            
            if (mb_ereg_match("^[A-Z0-9]{5,}$",$val)) {
                $substr = mb_substr($val,4).mb_substr($val,0,4);
                $val = str_replace(range("A","Z"),range("10","35"),$substr);
                
                if (bcmod(ltrim($val,"0"),"97") == "1") {
                    $result = true;
                }
            }
            
            return $result;
        }
    }