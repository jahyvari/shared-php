<?php
    class APIException extends Exception {
        private $_apiCode       = 9999;
        private $_apiMessage    = null;
        
        public function __construct($apiMessage,$apiCode = 9999,$message = null,$code = 0,Exception $previous = null) {
            $this->_apiCode     = $apiCode;
            $this->_apiMessage  = $apiMessage;
            
            # FIXME: $message muuttujan sisältö voidaan logittaa sovelluslogiin.
            # $apiMessage muuttujan on tarkoitus näkyä käyttäjälle.
            
            parent::__construct($message,$code,$previous);
        }
        
        public function getAPICode() {
            return $this->_apiCode;
        }
        
        public function getAPIMessage() {
            return $this->_apiMessage;
        }
    }