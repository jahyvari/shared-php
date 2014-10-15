<?php
    class Test extends APIBase {
        /**
         * Testifunktio joka nostaa virheen.
         */
        public static function errorCall() {
            throw new APIException("Test error!",999);   
        }
        
        /**
         * Testiluokassa kaikki funktiot ovat kutsuttavissa.
         */
        public static function isCallable($function) {
            return true;
        }
        
        /**
         * Testifunktio.
         *
         * @param   array   $data
         * @return  string
         */
        public static function testCall($data) {
            $export = var_export($data,true);            
            return <<<END
Test function!

Your data:
**********
$export
END;
        }
    }