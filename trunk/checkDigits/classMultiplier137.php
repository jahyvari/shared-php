<?php
    class Multiplier137 {
        /**
         * Tarkastaa arvon kerroin 137 laskennan.
         *
         * @param   string  $val    Tarkastettava arvo
         * @return  bool
         */
        public static function checkMultiplier137($val) {
            $result = false;
            
            if (mb_ereg_match("^[0-9]{2,}$",$val) && (int)$val > 0) {
                $strlen = mb_strlen($val);
                $multipliers = str_repeat("731",ceil($strlen/3));
                $x = 0;
                $sum = 0;
                
                for ($i = ($strlen-2); $i >= 0; $i--) {
                    $sum += mb_substr($val,$i,1)*mb_substr($multipliers,$x++,1);
                }
                
                $check = round($sum,-1)-$sum;
                
                if (mb_substr($check,-1) == mb_substr($val,-1)) {
                    $result = true;
                }
            }
            
            return $result;
        }
    }