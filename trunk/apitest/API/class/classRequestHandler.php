<?php
    /**
     * Paluukoodit:
     * ------------
     * 0    = OK
     * 888  = Ei käyttöoikeutta
     * 999  = Virhe kutsussa
     * 9999 = Tuntematon virhe
     */
    class RequestHandler {
        /**
         * Funktio käsittelee rajapintaan tulleen kutsun.
         *
         * Funktio palauttaa aina taulukon jossa on sarakkeet
         * code, text ja data.
         *
         * Code = palautekoodi (int)
         * Text = palauteteksti (string tai array)
         * Data = paluudata (mixed)
         *
         * @param   string  $class      Kutsuttava luokka
         * @param   string  $function   Kutsuttava funktio
         * @param   array   $data       Data kutsuun (vapaaehtoinen)
         * @return  array
         */
        public static function process($class,$function,$data = array()) {
            $result = array(
                "code"  => 0, # 0 = OK
                "text"  => "OK",
                "data"  => null
            );
            
            try {
                $code = 999; # 999 = virhe kutsussa
                
                # Luokan nimi puuttuu
                if (!is_string($class) || !$class) {
                    throw new APIException("Class name is missing",$code);
                }
                                
                # Funktion nimi puuttuu
                if (!is_string($function) || !$function) {
                    throw new APIException("Function name is missing",$code);
                }
                                                
                # Data ei ole taulukko
                if (!is_array($data)) {
                    throw new APIException("Data is not an array",$code);
                }
                
                # Onko käyttöoikeutta kutsuun
                if (!Login::checkAccess($class,$function)) {
                    # FIXME: Luo login luokka loppuun joka tarkastaa
                    # kirjautumisen ja käyttöoikeuden funktiokutsuun
                    throw new APIException("Access denied!",888); # 888 = Ei käyttöoikeutta
                }
                
                # Kutsu funktiota luokasta joka prosessoi kutsun
                $result["data"] = $class::$function($data);
            } catch (APIException $e) {                
                $result["code"] = $e->getAPICode();
                $result["text"] = $e->getAPIMessage();
            } catch (Exception $e) {                
                $result["code"] = 9999; # 9999 = Tuntematon virhe
                $result["text"] = $e->getMessage();
            }
            
            return $result;
        }
    }