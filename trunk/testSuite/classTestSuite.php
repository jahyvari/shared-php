<?php
    class TestSuite {
        private static $_sanityCheck = false;
        
        /**
         * Funktion avulla voidaan verrata täsmääkö kaksi muuttujaa toisiinsa.
         * 
         * @param   mixed   $excepted   Odotettu paluuarvo
         * @param   mixed   $result     Paluuarvo
         * @return  bool
         */
        private static function _compare($excepted,$result) {
            # Arvot täsmäävät täysin
            if ($excepted === $result) {
                return true;
            }
            
            $floatPattern = "^[0-9]{1,}(\.[0-9]{1,})?$";
            $intPattern = "^[0-9]{1,}$";            
            
            # Verrataan odotettua paluuarvoa ja paluuarvoa datatyypin konversion avulla
            $compare = false;
            $type = gettype($excepted);
            switch ($type) {
                case "boolean": # Boolean
                    if ($excepted === (bool)$result) {
                        $compare = true;
                    }
                    break;
                
                case "integer": # Kokonaisluku
                    if (is_string($result) || is_numeric($result)) {
                        if (mb_ereg_match($intPattern,$result) &&
                            $excepted === (int)$result) {
                            $compare = true;
                        }
                    } else if (is_bool($result)) {
                        $compare = self::_compare($excepted,(int)$result);
                    }
                    break;
                
                case "double": # Liukuluku
                    if (is_string($result) || is_numeric($result)) {
                        if (mb_ereg_match($floatPattern,$result)) {
                            # Liukuluvut ovat riittävän lähellä toisiaan
                            if (abs($excepted-(double)$result) < 0.0000000001) {
                                $compare = true;
                            }
                        }
                    }
                    break;
                
                case "string": # Merkkijono
                    if (is_string($result) || is_numeric($result)) {
                        if (mb_ereg_match($intPattern,$excepted) &&
                                mb_ereg_match($intPattern,$result)) {
                            # Molemmat arvot ovat kokonaislukuja merkkijonossa
                            $compare = self::_compare((int)$excepted,(int)$result);
                        } else if (mb_ereg_match($floatPattern,$excepted) &&
                                mb_ereg_match($floatPattern,$result)) {
                            # Molemmat arvot ovat liukulukuja merkkijonossa
                            $compare = self::_compare((double)$excepted,(double)$result);
                        }
                    } else if (is_bool($result)) {
                        $compare = self::_compare($excepted,(string)$result);
                    }
                    break;
                
                default: # Muu tietotyyppi
                    # Tietotyypit ovat samoja ja täsmävät löysällä vertailulla
                    if ($type == gettype($result) && $excepted == $result) {
                        $compare = true;
                    }
            }
                        
            return $compare;
        }
        
        /**
         * Tarkasta _compare funktion kelvollisuus ja lopeta skriptin suoritus
         * mikäli funktio ei toimi halutulla tavalla.
         *
         * @return  bool
         */
        private static function _sanity() {
            try {
                if (!self::_compare(true,true)) {
                    throw new Exception("Sanity check true==true failed!");
                }
                
                if (!self::_compare(false,false)) {
                    throw new Exception("Sanity check false==false failed!");
                }
                
                if (self::_compare(true,false)) {
                    throw new Exception("Sanity check true==false failed!");
                }
                
                if (!self::_compare(1,1)) {
                    throw new Exception("Sanity check 1==1 failed!");
                }
                
                if (!self::_compare(1,"1")) {
                    throw new Exception("Sanity check 1=='1' failed!");
                }
                
                if (!self::_compare(1,true)) {
                    throw new Exception("Sanity check 1==true failed!");
                }
                
                if (!self::_compare("1",true)) {
                    throw new Exception("Sanity check '1'==true failed!");
                }
                                
                if (self::_compare(0,true)) {
                    throw new Exception("Sanity check 0!=true failed!");
                }
                                
                if (self::_compare("0",true)) {
                    throw new Exception("Sanity check '0'!=true failed!");
                }
                
                if (!self::_compare(0.5,0.5)) {
                    throw new Exception("Sanity check 0.5==0.5 failed!");
                }
                
                if (!self::_compare(0.5,"0.5")) {
                    throw new Exception("Sanity check 0.5=='0.5' failed!");
                }
                
                if (self::_compare(0.4,0.39999)) {
                    throw new Exception("Sanity check 0.4!=0.39999 failed!");
                }
                
                if (!self::_compare(array(1),array(1))) {
                    throw new Exception("Sanity check array(1)==array(1) failed!");
                }
                
                if (self::_compare(array(1),array(2))) {
                    throw new Exception("Sanity check array(1)!=array(2) failed!");
                }
                
                if (self::_compare(array(1,2),array(2,1))) {
                    throw new Exception("Sanity check array(1,2)!=array(2,1) failed!");
                }
                
                if (!self::_compare(array("b" => 2,"a" => 1),
                    array("a" => "1","b" => 2))) {
                    throw new Exception("Sanity check array('b'=>2,'a'=>1)==array('b'=>2,'a'=>1) failed!");
                }
                
                if (!self::_compare(new TestSuite(),new TestSuite())) {
                    throw new Exception("Sanity check TestSuite()==TestSuite() failed!");
                }
                
                if (self::_compare(new TestSuite(),(object)1)) {
                    throw new Exception("Sanity check TestSuite()!=(object)1 failed!");
                }
            } catch (Exception $e) {
                echo $e->getMessage().PHP_EOL;
                exit(1);
            }
            
            return true;
        }
        
        /**
         * Funktion avulla voidaan testata palauttaako anymyymina funktiona
         * syötetty testitapaus odotetun paluuarvon.
         *
         * Funktio lopettaa skriptin suorituksen mikäli arvot eivät täsmää.
         *
         * @param   string      $name       Testin nimi
         * @param   function    $function   Anonyymi funktio
         * @param   mixed       $excepted   Odotettu paluuarvo (oletus TRUE)
         * @return  bool
         */
        public static function test($name,$function,$excepted = true) {
            # Tarkastetaan testiluokan kelvollisuus
            if (!self::$_sanityCheck) {
                self::_sanity();
                self::$_sanityCheck = true;    
            }
                
            try {                                
                if (!is_callable($function)) {
                    throw new Exception("Function is not callable!");
                }                                
                
                $result = $function();
                $compare = self::_compare($excepted,$result);
                
                # Palaute ei täsmää 
                if (!$compare) {
                    $dump1 = var_export($excepted,true);
                    $dump2 = var_export($result,true);
                    throw new Exception(<<<END
Excepted value and returned value do not match!
---------
Excepted: $dump1
---------
Returned: $dump2
---------
END
);
                }
            } catch (Exception $e) {
                echo "Error at $name: ".$e->getMessage().PHP_EOL;
                exit(1);
            }
            
            return true;
        }
    }