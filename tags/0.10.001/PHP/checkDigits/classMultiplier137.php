<?php
    namespace SharedPHP;
    
    class Multiplier137 {
        /**
         * Tarkastaa arvon kerroin 137 tarkisteen.
         *
         * @param   string  $val    Tarkastettava arvo
         * @return  bool
         */
        public static function checkMultiplier137($val) {
            $result = false;
            
            if (mb_ereg_match("^[0-9]{4,}$",$val)) {
                $check = self::createMultiplier137CheckDigit(mb_substr($val,0,-1));
                if ($check !== false && $check == mb_substr($val,-1)) {
                    $result = true;
                }
            }
            
            return $result;
        }
        
        /**
         * Luo arvon kerroin 137 tarkisteen.
         *
         * @param   string  $val    Arvo
         * @return  mixed
         */
        public static function createMultiplier137CheckDigit($val) {
            $result = false;
            
            if (mb_ereg_match("^[0-9]{3,}$",$val) && ltrim($val,"0")) {
                $strlen = mb_strlen($val);
                $multipliers = array(7,3,1);
                $x = 0;
                $sum = 0;
                
                for ($i = ($strlen-1); $i >= 0; $i--) {
                    $sum += mb_substr($val,$i,1)*$multipliers[$x++];
                    if ($x == 3) {
                        $x = 0;
                    }
                }
                
                $result = (int)mb_substr((10-$sum%10),-1);
            }
            
            return $result;
        }
    }