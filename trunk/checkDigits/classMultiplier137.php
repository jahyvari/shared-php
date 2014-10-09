<?php
    class Multiplier137 {
        /**
         * Tarkastaa arvon kerroin 137 tarkisteen.
         *
         * @param   string  $val    Tarkastettava arvo
         * @return  bool
         */
        public static function checkMultiplier137($val) {
            $result = false;
            
            if (mb_ereg_match("^[0-9]{2,}$",$val) && ltrim($val,"0")) {
                $strlen = mb_strlen($val);
                $multipliers = array(7,3,1);
                $x = 0;
                $sum = 0;
                
                for ($i = ($strlen-2); $i >= 0; $i--) {
                    $sum += mb_substr($val,$i,1)*$multipliers[$x++];
                    if ($x == 3) {
                        $x = 0;
                    }
                }
                
                $check = 10-$sum%10;
                
                if (mb_substr($check,-1) == mb_substr($val,-1)) {
                    $result = true;
                }
            }
            
            return $result;
        }
    }