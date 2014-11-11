<?php
    namespace SharedPHP;
    
    class Modulo {
        /**
         * Tarkastaa arvon Luhn mod 10 tarkisteen.
         *
         * @param   string  $val    Tarkastettava arvo
         * @return  bool
         */
        public static function checkLuhnMod10($val) {
            $result = false;
            
            if (mb_ereg_match("^[0-9]{2,}$",$val) && ltrim($val,"0")) {
                $multiplier = 2;
                $strlen = mb_strlen($val);
                $sum = 0;
                
                for ($i = ($strlen-2); $i >= 0; $i--) {
                    $sum += array_sum(str_split(mb_substr($val,$i,1)*$multiplier--,1));
                    if ($multiplier == 0) {
                        $multiplier = 2;
                    }
                }
                                                
                $check = 10-$sum%10;
                
                if (mb_substr($check,-1) == mb_substr($val,-1)) {
                    $result = true;
                }
            }
            
            return $result;
        }
        
        /**
         * Tarkastaa arvon modulo 10 tarkisteen.
         *
         * @param   string  $val    Tarkastettava arvo
         * @return  bool
         */
        public static function checkModulo10($val) {
            $result = false;
            
            if (mb_ereg_match("^[0-9]{2,}$",$val) && ltrim($val,"0")) {
                $multiplier = 3;
                $strlen = mb_strlen($val);
                $sum = 0;
                
                for ($i = ($strlen-2); $i >= 0; $i--) {
                    $sum += mb_substr($val,$i,1)*$multiplier;
                    $multiplier = (($multiplier == 3) ? 1 : 3);
                }
                
                $check = 10-$sum%10;
                
                if (mb_substr($check,-1) == mb_substr($val,-1)) {
                    $result = true;
                }
            }
            
            return $result;
        }
        
        /**
         * Tarkastaa arvon modulo 31 tarkisteen.
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
                
                $num = ltrim(mb_substr($val,0,-1),"0");
                
                if ($num) {
                    $check = bcmod($num,"31");                    
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
         * Tarkastaa arvon modulo 97-10 tarkisteen.
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
        
        /**
         * Luo arvon modulo 97-10 tarkisteen.
         *
         * @param   string  $prefix Etuliite (esim. RF)
         * @param   string  $val    Arvo         
         * @return  mixed
         */
        public static function createModulo97_10CheckDigit($prefix,$val) {
            $result = false;
            
            if (mb_ereg_match("^[A-Z0-9]{1,}$",$val) && strlen($prefix) == 2) {
                $val = str_replace(range("A","Z"),range("10","35"),$val.$prefix."00");                
                $mod = 98-(int)bcmod(ltrim($val,"0"),"97");                
                $result = (string)(($mod < 10) ? "0".$mod : $mod);                
            }
            
            return $result;
        }
    }