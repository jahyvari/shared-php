<?php
    namespace SharedPHP;
        
    class UnitConverter {
        const CM_TO_INCH    = 0.393700787;
        const FOOT_TO_YARD  = 3;
        const FOOT_TO_MILE  = 5280;
        const INCH_TO_FOOT  = 12;
        const KG_TO_LB      = 2.20462262;
        const KM_TO_MILE    = 0.621371192;
        const PICA_TO_INCH  = 6;
        const POINT_TO_PICA = 12;
        const YARD_TO_MILE  = 1760;
        
        /**
         * Muuttaa senttimetrit jaloiksi.
         * 
         * @param   double  $cm     Pituus senttimetreinä
         * @return  mixed
         */                
        public static function cmToFoot($cm) {
            $result = false;
            
            if (is_numeric($cm)) {
                $result = self::inchToFoot(self::cmToInch($cm));
            }
            
            return $result;
        }
        
        /**
         * Muuttaa senttimetrit tuumiksi.
         * 
         * @param   double  $cm     Pituus senttimetreinä
         * @return  mixed
         */
        public static function cmToInch($cm) {
            $result = false;
            
            if (is_numeric($cm)) {
                $result = $cm*self::CM_TO_INCH;
            }
            
            return $result;
        }
        
        /**
         * Muuttaa jalat senttimetreiksi.
         * 
         * @param   double  $foot   Pituus jalkoina 
         * @return  mixed
         */
        public static function footToCm($foot) {
            $result = false;
            
            if (is_numeric($foot)) {
                $result = self::inchToCm(self::footToInch($foot));
            }
            
            return $result;
        }
        
        /**
         * Muuttaa jalat tuumiksi.
         * 
         * @param   double  $foot   Pituus jalkoina 
         * @return  mixed
         */
        public static function footToInch($foot) {
            $result = false;
            
            if (is_numeric($foot)) {
                $result = $foot*self::INCH_TO_FOOT;
            }
            
            return $result;
        }
        
        /**
         * Muuttaa tuumat centtimetreiksi.
         * 
         * @param   double  $inch   Pituus tuumina 
         * @return  mixed
         */
        public static function inchToCm($inch) {
            $result = false;
            
            if (is_numeric($inch)) {
                $result = $inch/self::CM_TO_INCH;
            }
            
            return $result;
        }
        
        /**
         * Muuttaa tuumat jaloiksi.
         * 
         * @param   double  $inch   Pituus tuumina 
         * @return  mixed
         */
        public static function inchToFoot($inch) {
            $result = false;
            
            if (is_numeric($inch)) {
                $result = $inch/self::INCH_TO_FOOT;
            }
            
            return $result;
        }
        
        /**
         * Muuttaa kilogrammat paunoiksi.
         *
         * @param   double  $kg     Paino kilogrammoina
         * @return  mixed
         */
        public static function kgToLb($kg) {
            $result = false;
            
            if (is_numeric($kg)) {
                $result = $kg*self::KG_TO_LB;
            }
            
            return $result;
        }
        
        /**
         * Muuttaa kilometrit maileiksi.
         *
         * @param   double  $km     Pituus kilometreinä
         * @return  mixed
         */
        public static function kmToMile($km) {
            $result = false;
            
            if (is_numeric($km)) {
                $result = $km*self::KM_TO_MILE;
            }
            
            return $result;
        }
        
        /**
         * Muuttaa paunat kilogrammoiksi
         *
         * @param   double  $lb     Paino paunoina
         * @return  mixed
         */
        public static function lbToKg($lb) {
            $result = false;
            
            if (is_numeric($lb)) {
                $result = $lb/self::KG_TO_LB;
            }
            
            return $result;
        }
        
        /**
         * Muuttaa mailit kilometreiksi
         *
         * @param   double  $mile   Pituus maileina
         * @return  mixed
         */
        public static function mileToKm($mile) {
            $result = false;
            
            if (is_numeric($mile)) {
                $result = $mile/self::KM_TO_MILE;
            }
            
            return $result;
        }
    }