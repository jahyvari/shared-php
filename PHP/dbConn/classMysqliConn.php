<?php
    require_once(__DIR__.DIRECTORY_SEPARATOR."classDbConn.php");
    
    class MysqliConn extends DbConn {        
        const FETCH_ASSOC   = MYSQLI_ASSOC;
        const FETCH_BOTH    = MYSQLI_BOTH;
        const FETCH_NUM     = MYSQLI_NUM;
        
        protected function _affectedRows() {
            return mysqli_affected_rows($this->link);
        }
        
        protected function _connect() {
            $this->link = mysqli_init();
                
            # Connection timeout
            if ($this->timeout !== null && $this->timeout >= 0) {
                mysqli_options(
                    $this->link,
                    MYSQLI_OPT_CONNECT_TIMEOUT,
                    $this->timeout
                );
            }
                        
            $result = mysqli_real_connect(
                $this->link,
                $this->host,
                $this->username,
                $this->passwd,
                $this->database,
                $this->port
            );
            
            return $result;
        }
        
        protected function _connectErrno() {
            return mysqli_connect_errno($this->link);
        }
        
        protected function _connectError() {
            return mysqli_connect_error($this->link);
        }
        
        protected function _disconnect() {            
            return mysqli_close($this->link);
        }
        
        protected function _dataSeek($query,$offset) {
            return mysqli_data_seek($query,$offset);
        }
        
        protected function _errno() {
            return mysqli_errno($this->link);
        }
        
        protected function _error() {
            return mysqli_error($this->link);
        }
        
        protected function _escapeString($value) {
            return mysqli_real_escape_string($this->link,$value);
        }
        
        protected function _fetch($query,$resulttype,$offset) {
            $result = false;
            $seek = true;
            
            if ($offset !== null) {
                $seek = $this->_dataSeek($query,$offset);
            }
                        
            if ($seek) {
                $result = mysqli_fetch_array($query,$resulttype);
                if ($result === null) {
                    $result = false;
                }
            }
            
            return $result;
        }
        
        protected function _freeResult($query) {
            return mysqli_free_result($query);
        }
        
        protected function _insertId() {
            return mysqli_insert_id($this->link);
        }
        
        protected function _numRows($query) {
            return mysqli_num_rows($query);
        }
        
        protected function _query($sql) {
            return mysqli_query($this->link,$sql);
        }
    }