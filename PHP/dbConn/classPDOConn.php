<?php
    require_once(__DIR__.DIRECTORY_SEPARATOR."classDbConn.php");
    
    class PDOConn extends DbConn {
        const FETCH_ASSOC   = PDO::FETCH_ASSOC;
        const FETCH_BOTH    = PDO::FETCH_BOTH;
        const FETCH_NUM     = PDO::FETCH_NUM;
        
        private $_affectedRows  = 0;
        private $_connectErrno  = 0;
        private $_connectError  = "";
        private $_driver        = null;
        
        public function __construct($driver,$data = array()) {
            $this->_driver = $driver;
            parent::__construct($data);
        }
        
        protected function _affectedRows() {
            return $this->_affectedRows;
        }
        
        protected function _connect() {
            $result = false;
            
            try {
                $options = array();
                
                # Connection timeout
                if ($this->timeout !== null && $this->timeout >= 0) {
                    $options[PDO::ATTR_TIMEOUT] = $this->timeout;
                }
                
                # Muodostetaan DSN
                switch ($this->_driver) {
                    case "mysql": # MySQL
                        $dsn = "mysql:dbname={$this->database};host={$this->host}";
                        break;
                    
                    case "pgsql": # PgSQL
                        $dsn = "pgsql:dbname={$this->database};host={$this->host}";
                        break;
                    
                    case "sqlite": # SQLite
                        $dsn = "sqlite:{$this->host}";
                        break;
                    
                    default:
                        throw new Exception("Invalid driver {$this->_driver}");
                }                
                
                $this->link = new PDO($dsn,$this->username,$this->passwd,$options);                
                $result = true;
            } catch (PDOException $e) {
                $this->_connectErrno = $e->getCode();
                $this->_connectError = $e->getMessage();
            }
            
            return $result;
        }
        
        protected function _connectErrno() {
            return $this->_connectErrno;
        }
        
        protected function _connectError() {
            return $this->_connectError;
        }
        
        protected function _dataSeek($query,$offset) {
            # PDO:ssa ei ole tähän funktiota
            return false;
        }
        
        protected function _disconnect() {
            $this->_affectedRows = 0;
            return true;
        }
        
        protected function _errno() {
            $result = 0;
            $error = $this->link->errorInfo();
            
            if (isset($error[1])) {
                $result = $error[1];
            }
            
            return $result;
        }
        
        protected function _error() {
            $result = "";
            $error = $this->link->errorInfo();
            
            if (isset($error[2])) {
                $result = $error[2];
            }
            
            return $result;
        }
        
        protected function _escapeString($value) {
            $result = $this->link->quote($value);
            
            if (preg_match("/^'[\S\s]{1,}'$/",$result)) {
                $result = mb_substr($result,1,-1);
            }
            
            return $result;
        }
        
        protected function _fetch($query,$resulttype,$offset) {
            $result = false;
            
            if ($query instanceof PDOStatement) {
                if ($offset !== null) {
                    $result = $query->fetch($resulttype,PDO::FETCH_ORI_ABS,$offset);             
                } else {
                    $result = $query->fetch($resulttype);
                }
            }
            
            return $result;
        }
                
        protected function _freeResult($query) {
            $result = false;
            
            if ($query instanceof PDOStatement) {
                $result = $query->closeCursor();
            }
            
            return $result;
        }
        
        protected function _insertId() {
            return $this->link->lastInsertId();
        }
        
        protected function _numRows($query) {
            $result = 0;
            
            if ($query instanceof PDOStatement) {
                $sql = trim($query->queryString);
                if (preg_match("/^(delete|insert|replace|update)/i",$sql) === 0) {
                    $result = $query->rowCount();
                }
            }
            
            return $result;
        }
                
        protected function _query($sql) {
            $this->_affectedRows = 0;
            
            $query = $this->link->prepare($sql,array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));

            if ($query instanceof PDOStatement) {
                if ($query->execute()) {
                    $sql = trim($query->queryString);
                    if (preg_match("/^(delete|insert|replace|update)/i",$sql)) {
                        $this->_affectedRows = $query->rowCount();
                    }
                } else {
                    $query = false;
                }
            }
            
            return $query;
        }
    }