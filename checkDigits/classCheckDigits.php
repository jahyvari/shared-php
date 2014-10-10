<?php
    require_once(__DIR__.DIRECTORY_SEPARATOR."classModulo.php");
    require_once(__DIR__.DIRECTORY_SEPARATOR."classMultiplier137.php");
    
    class CheckDigits {
        /**
         * Tarkastaa suomalaisen konekielisen BBAN tilinumeron.
         *
         * @param   string  $bban   BBAN
         * @return  bool
         */
        public static function checkFIBBAN($bban) {
            $result = false;
                        
            if (mb_ereg_match("^[1-8]{1}[0-9]{7,13}$",$bban)) {
                $part1 = mb_substr($bban,0,6);
                $part2 = mb_substr($bban,6);
                $count = 8-mb_strlen($part2);
                
                switch (mb_substr($bban,0,1)) {
                    case "4":
                    case "5":
                        $part2 = mb_substr($part2,0,1).
                            str_repeat("0",$count).
                            mb_substr($part2,1);
                        break;                    
                    default:
                        $part2 = str_repeat("0",$count).$part2;
                }
                                
                $result = Modulo::checkLuhnMod10($part1.$part2);
            }
            
            return $result;
        }
        
        /**
         * Tarkastaa suomalaisen Y-tunnuksen.
         *
         * @param   string  $businessid Y-tunnus
         * @return  bool
         */
        public static function checkFIBusinessId($businessid) {
            $result = false;
            
            if (mb_ereg_match("^[0-9]{7}[\-]{1}[0-9]{1}$",$businessid)) {
                $multipliers = array(7,9,10,5,8,4,2);
                $substr = mb_substr($businessid,0,7);
                $strlen = mb_strlen($substr);
                $total = 0;
                
                for ($i = 0; $i < $strlen; $i++) {
                    $total += mb_substr($substr,$i,1)*$multipliers[$i];
                }
                
                if ($total > 0) {
                    $check = $total%11;
                    
                    if ($check == 0 || ($check >= 2 && $check <= 10)) {
                        if ($check >= 2) {
                            $check = 11-$check;
                        }
                        
                        if (mb_substr($businessid,-1) == $check) {
                            $result = true;
                        }
                    }
                }
            }
            
            return $result;
        }
        
        /**
         * Tarkastaa suomalaisen viitenumeron.
         *
         * @param   string  $reference  Viitenumero
         * @return  bool
         */
        public static function checFIReference($reference) {
            $result = false;
            
            if (mb_ereg_match("^[0-9]{4,20}$",$reference)) {
                $result = Multiplier137::checkMultiplier137($reference);
            }
            
            return $result;
        }
        
        /**
         * Tarkastaa IBAN tilinumeron.
         *
         * @param   string  $iban   IBAN
         * @return  bool
         */
        public static function checkIBAN($iban) {
            $result = false;
            
            if (mb_ereg_match("^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$",$iban)) {
                $result = Modulo::checkModulo97_10($iban);
            }
            
            return $result;
        }
        
        /**
         * Tarkastaa suomalaisen henkilötunnuksen.
         *
         * @param   string  $personid   Henkilötunnus
         * @return  bool
         */
        public static function checkFIPersonId($personid) {
            $result = false;
            
            if (mb_ereg_match("^[0-9]{6}[\+\-A]{1}[0-9]{3}[0-9A-FHJ-NPR-Y]{1}$",$personid)) {
                $part1 = mb_substr($personid,0,6);
                $part2 = mb_substr($personid,7,4);
                $delimiter = mb_substr($personid,6,1);
                
                $arr = str_replace(array("+","-","A"),array("18","19","20"),$delimiter).
                    implode("-",array_reverse(str_split($part1,2)));
                    
                list($year,$month,$day) = explode("-",$arr);
                                
                if (checkdate((int)$month,(int)$day,$year)) {
                    $result = Modulo::checkModulo31($part1.$part2);
                }
            }
            
            return $result;
        }
        
        /**
         * Tarkastaa RF viitteen.
         *
         * @param   string  $reference  Viite
         * @return  bool
         */
        public static function checkRFReference($reference) {
            $result = false;
            
            if (mb_ereg_match("^RF[0-9]{2}[A-Z0-9]{1,21}$",$reference)) {
                $result = Modulo::checkModulo97_10($reference);
            }
            
            return $result;
        }
    }