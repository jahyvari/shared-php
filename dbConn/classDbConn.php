<?php
    abstract class DbConn {
        const FETCH_ASSOC   = null;
        const FETCH_BOTH    = null;
        const FETCH_NUM     = null;
        
        private $_data = array(
            "connected" => false,
            "database"  => null,
            "host"      => null,
            "link"      => null,
            "passwd"    => null,
            "port"      => null,
            "timeout"   => null,
            "username"  => null            
        );
        
        private $_transactions = array();
        
        public function __construct($data = array()) {
            if (is_array($data)) {
                foreach ($data as $key => $value) {
                    $this->$key = $value;
                }
            }
        }
        
        public function __get($name) {
            if (!array_key_exists($name,$this->_data)) {
                throw new Exception("Invalid name $name");
            }            
            return $this->_data[$name];
        }
        
        public function __set($name,$value) {
            if (!array_key_exists($name,$this->_data)) {
                throw new Exception("Invalid name $name");
            }            
            $this->_data[$name] = $value;
        }
        
        /**
         * Palauttaa INSERT, UPDATE, REPLACE tai DELETE kyselyn
         * affected rows tiedon.
         *
         * @return int
         */
        public function affectedRows() {
            $result = -1;
            
            if ($this->connect()) {
                $result = $this->_affectedRows();
            }
            
            return $result;
        }
        protected abstract function _affectedRows();
        
        /**
         * Aloittaa transaktion.
         *
         * @return bool
         */
        public function begin() {
            if (empty($this->_transactions)) {
                $savepoint = null;
                $sql = "START TRANSACTION";
            } else {
                $savepoint = "sp".count($this->_transactions);
                $sql = "SAVEPOINT $savepoint";
            }
                        
            $result = $this->query($sql);
            
            if ($result) {
                $this->_transactions[] = $savepoint;
            }
            
            return $result;
        }
        
        /**
         * Päättää transaktion.
         *
         * @return bool
         */
        public function commit() {
            $result = false;
            
            if (!empty($this->_transactions)) {
                $savepoint = array_pop($this->_transactions);
                
                if (empty($savepoint)) {
                    $sql = "COMMIT";
                } else {
                    $sql = "RELEASE SAVEPOINT $savepoint";
                }
                
                $result = $this->query($sql);
                
                if (!$result) {
                    $this->_transactions[] = $savepoint;
                }
            }
            
            return $result;
        }
                        
        /**
         * Yhdistää tietokantaan.
         *
         * @return bool
         */
        public function connect() {
            $result = false;
            
            if (!$this->connected) {
                $result = $this->_connect();
                if ($result) {
                    $this->connected = true;
                }
            } else {
                $result = true;
            }
            
            return $result;
        }
        protected abstract function _connect();
        
        /**
         * Palauttaa yhteyden avauksen aiheuttaman virhekoodin.
         *
         * @return int
         */
        public function connectErrno() {
            return $this->_connectErrno();   
        }
        protected abstract function _connectErrno();
        
        /**
         * Palauttaa yhteyden avauksen aiheuttaman virheen.
         *
         * @return string
         */
        public function connectError() {            
            return $this->_connectError();   
        }
        protected abstract function _connectError();
        
        /**
         * Siirtää kyselyn kursorin halutulle riville.
         *
         * @param   object  $query  Kysely
         * @param   int     $offset Rivinro
         * @return  bool
         */
        public function dataSeek($query,$offset) {
            $result = false;
            
            if ($query) {
                $result = $this->_dataSeek($query,$offset);
            }
            
            return $result;
        }
        protected abstract function _dataSeek($query,$offset);
        
        /**
         * Sulkee tietokantayhteyden.
         *
         * @return bool
         */
        public function disconnect() {
            $result = false;
            
            if ($this->connected) {
                $result = $this->_disconnect();
                if ($result) {
                    $this->connected = false;
                    $this->link = null;
                }
            }
            
            return $result;
        }
        protected abstract function _disconnect();
        
        /**
         * Palauttaa kyselyn aiheuttaman virhekoodin.
         *
         * @return int
         */
        public function errno() {
            $result = 0;
            
            if ($this->connect()) {
                $result = $this->_errno();
            }
            
            return $result;   
        }
        protected abstract function _errno();
        
        /**
         * Palauttaa kyselyn aiheuttaman virheen.
         *
         * @return string
         */
        public function error() {
            $result = "";
            
            if ($this->connect()) {
                $result = $this->_error();
            }
            
            return $result;   
        }
        protected abstract function _error();
        
        /*
         * Funktio tekee parametristä tietoturvallisen
         * SQL - injektioiden varalta.
         *
         * Parametri voi olla taulukko jolloin taulukon
         * arvot palautetaan pilkulla eroteltuina.
         *
         * NULL parametri palautetaan merkkijonona "NULL".
         *
         * Muissa tietotyypeissä (kokonaisluku,merkkijono jne.)
         * asetetaan ' - merkit parametrin ympärille.
         * 
         * @param   mixed   $value  Parametri
         * @return  string
         */
        public function escape($value) {            
            if (is_null($value)) {
                $result = "NULL";
            } else if (is_array($value)) {
                if (!empty($value)) {
                    $result = "";                    
                    foreach ($value as $data) {
                        $result .= ((mb_strlen($result)) ? ", " : "");
                        $result .= $this->escape($data);    
                    }   
                } else {
                    throw new Exception("Value is an empty array");
                }
            } else {
                $result = "'".$this->escapeString($value)."'";
            }
            
            return $result;
        }
        
        /**
         * Ajaa parametrin escape string funktion läpi.
         *
         * @param   string  $value  Parametri
         * @return  mixed
         */
        public function escapeString($value) {
            $result = false;
            
            if ($this->connect()) {
                $result = $this->_escapeString($value);
            }
            
            return $result;    
        }
        protected abstract function _escapeString($value);
        
        /**
         * Palauttaa SELECT lauseen rivin taulukossa.
         *
         * @param   object  $query      Kysely
         * @param   int     $resulttype Taulukon tyyppi (oletus FETCH_BOTH)
         * @param   int     $offset     Rivi joka haetaan (oletus seuraava rivi)
         * @return  mixed
         */
        public function fetch($query,$resulttype = null,$offset = null) {
            $result = false;
            
            if ($query) {
                if ($resulttype === null) {
                    $class = get_class($this);
                    $resulttype = $class::FETCH_BOTH;
                }
                
                $result = $this->_fetch($query,$resulttype,$offset);
            }
            
            return $result;
        }
        protected abstract function _fetch($query,$resulttype,$offset);
        
        /**
         * Palauttaa kyselyn kaikki rivit taulukossa.
         *
         * @param   object  $query  Kysely
         * @param   int     $resulttype Taulukon tyyppi (oletus FETCH_ASSOC)
         * @return  array
         */
        public function fetchAll($query,$resulttype = null) {
            $result = array();
            
            if ($resulttype === null) {
                $class = get_class($this);
                $resulttype = $class::FETCH_ASSOC;
            }
            
            $offset = 0;
            while ($row = $this->fetch($query,$resulttype,$offset)) {
                $result[] = $row;
                $offset = null;
            }
            
            return $result;
        }
        
        /**
         * Palauttaa SELECT lauseen rivin taulukossa FETCH_ASSOC tyypillä.
         * 
         * @param   object  $query      Kysely
         * @param   int     $offset     Rivi joka haetaan (oletus seuraava rivi)
         * @return  mixed
         */
        public function fetchAssoc($query,$offset = null) {
            $class = get_class($this);
            return $this->fetch($query,$class::FETCH_ASSOC,$offset);
        }
        
        /**
         * Vapauttaa SELECT kyselyyn varaaman muistin.
         *
         * @param   object  $query  SELECT kysely
         * @return  bool
         */
        public function freeResult($query) {
            $result = false;
            
            if ($query) {
                $result = $this->_freeResult($query);
            }
            
            return $result;
        }
        protected abstract function _freeResult($query);
        
        /**
         * Ajaa INSERT kyselyn ja palauttaa insert id:n.
         *
         * @param   string  $table  Taulu jonne tallennetaan
         * @param   array   $data   Arvot jotka tallennetaan
         * @return  int
         */
        public function insert($table,$data) {
            $sql = $this->insertStr($table,$data);
            
            $this->query($sql);
            
            return $this->insertId();
        }
        
        /**
         * Palauttaa INSERT kyselyn insert id tiedon.
         *
         * @return int
         */
        public function insertId() {
            $result = 0;
            
            if ($this->connect()) {
                $result = $this->_insertId();
            }
            
            return $result;    
        }
        protected abstract function _insertId();
        
        /**
         * Luo INSERT kyselyn SQL - lauseen funktion parametrien
         * avulla.
         *
         * @param   string  $table  Taulu jonne tallennetaan
         * @param   array   $data   Arvot jotka tallennetaan
         * @return  string
         */
        public function insertStr($table,$data) {            
            if ($table == "") {
                throw new Exception("Table name is missing");
            }
            
            if (!is_array($data) || empty($data)) {
                throw new Exception("Data is not an array or is empty");
            }
            
            $keys = "";
            $values = "";
            foreach ($data as $key => $value) {
                $keys .= ((mb_strlen($keys)) ? ", " : "").$key;
                $values .= ((mb_strlen($values)) ? ", " : "").$this->escape($value);
            }
            
            $sql = "INSERT INTO $table ($keys) VALUES ($values)";
            
            return $sql;
        }
        
        /**
         * Palauttaa SELECT kyselyn rivien määrän.
         *
         * @param   object  $query  Kysely
         * @return  int
         */
        public function numRows($query) {
            $result = 0;
            
            if ($query) {
                $result = $this->_numRows($query);
            }
            
            return $result;
        }
        protected abstract function _numRows($query);
        
        /**
         * Funktio suorittaa tietoturvallisen SQL kyselyn.
         *
         * Kysely on muotoa "SELECT * FROM test WHERE id =:id".
         *
         * Parametrit eroitetaan kaksoispisteella ja asetetaan
         * $params taulukkoon.
         *
         * Funktio ajaa lopuksi lauseene query funktion läpi.
         *
         * @param   string  $sql    SQL lause
         * @param   array   $params Parametrit (vapaaehtoinen)
         * @return  mixed
         */
        public function preparedQuery($sql,$params = array()) {
            $result = false;
            
            if (mb_strlen($sql)) {
                $sql .= " ";
                
                # Löytyykö parametreja
                if (is_array($params) && !empty($params)) {
                    $bind = array();
                    
                    foreach ($params as $key => $value) {
                        $matches = array();
                        if (preg_match_all("/[:]{1}".preg_quote($key,"/")."[\\r\\n), ]{1}/",$sql,$matches,PREG_OFFSET_CAPTURE)) {
                            foreach($matches[0] as $match) {
                                $bind[$match[1]] = array(
                                    "strlen"    => mb_strlen($match[0])-1,
                                    "value"     => $value
                                );
                            }
                        } else {
                            throw new Exception("Cannot find key $key");
                        }
                    }

                    ksort($bind);                    
                    $replaced = 0;
                    
                    # Aloitetaan parametrien korvaus
                    foreach ($bind as $pos => $data) {
                        $value = $this->escape($data["value"]);
                                                    
                        $sql = mb_substr($sql,0,($pos-$replaced)).
                            $value.
                            mb_substr($sql,($pos+$data["strlen"]-$replaced));
                        
                        $replaced += ($data["strlen"]-mb_strlen($value));
                    }
                }
                
                $result = $this->query(mb_substr($sql,0,-1));
            }
            
            return $result;            
        }
        
        /**
         * Hakee tulosjoukon halutulta riviltä halutun sarakkeen arvon.
         * Kts. http://php.net/manual/en/function.mysql-result.php
         *
         * @param   object  $query  Kysely
         * @param   int     $offset Rivi
         * @param   mixed   $field  Sarake (sarakkeen nimi tai järjestysnumero)
         * @return  mixed
         */
        public function result($query,$offset,$field = 0) {
            $result = false;            
            $class = get_class($this);

            $row = $this->fetch($query,$class::FETCH_BOTH,$offset);
            if (is_array($row) && array_key_exists($field,$row)) {
                $result = $row[$field];
            }
            
            return $result;
        }
        
        /**
         * Palauttaa yield kutsun avulla SELECT kyselyn tulosjoukon.
         *
         * @param   string  $sql        SELECT lause
         * @param   array   $params     Parametrit kyselyyn (preparedQueryyn)
         * @param   int     $resulttype Taulukon tyyppi (oletus FETCH_ASSOC)
         * @return  mixed               Generator objekti tai tyhjä taulukko
         */
        public function select($sql,$params = array(),$resulttype = null) {
            $query = $this->preparedQuery($sql,$params);
                                                        
            if ($this->numRows($query)) {
                if ($resulttype === null) {
                    $class = get_class($this);
                    $resulttype = $class::FETCH_ASSOC;
                }
                
                return $this->_select($query,$resulttype);
            } else {
                return array();
            }
        }
        private function _select($query,$resulttype) {
            while ($row = $this->fetch($query,$resulttype)) {
                yield $row;
            }
            $this->freeResult($query);
        }
        
        /**
         * Ajaa UPDATE kyselyn ja palauttaa affected rows:n.
         *
         * @param   string  $table  Taulu jota päivitetään
         * @param   array   $data   Arvot jotka päivitetään
         * @param   mixed   $where  Rajoitusehdot
         * @param   int     $limit  Montako riviä päivitetään
         * @return  string
         */
        public function update($table,$data,$where,$limit = 1) {
            $sql = $this->updateStr($table,$data,$where,$limit);
            
            $this->query($sql);
            
            return $this->affectedRows();
        }
        
        /**
         * Luo UPDATE kyselyn SQL - lauseen funktion parametrien
         * avulla.
         *
         * Where ehto käytäytyy seuraavasti:
         *
         * Taulukko     = WHERE key=1 AND key2=2...
         * TRUE         = WHERE 1=1
         * Numeerinen   = WHERE id='1'
         * Merkkijono   = WHERE $where
         * Muu          = Keskeytys
         *
         * @param   string  $table  Taulu jota päivitetään
         * @param   array   $data   Arvot jotka päivitetään
         * @param   mixed   $where  Rajoitusehdot
         * @param   int     $limit  Montako riviä päivitetään
         * @return  string
         */
        public function updateStr($table,$data,$where,$limit = 1) {
            if ($table == "") {
                throw new Exception("Table name is missing");
            }
            
            if (!is_array($data) || empty($data)) {
                throw new Exception("Data is not an array or is empty");
            }
            
            if (empty($where)) {
                throw new Exception("Where is empty");
            }
            
            if (!is_numeric($limit)) {
                throw new Exception("Limit is not numeric");
            }
            
            $columns = "";
            foreach ($data as $key => $value) {
                $columns .= ((mb_strlen($columns)) ? ", " : "");
                $columns .= $key."=".$this->escape($value);
            }
            
            $cond = "";
            if (is_array($where)) {
                foreach ($where as $key => $value) {
                    $cond .= ((mb_strlen($cond)) ? " AND " : "");
                    $cond .= $key;
                    
                    if (is_null($value)) {
                        $cond .= " IS NULL";
                    } else if (is_array($value)) {
                        $cond .= " IN (".$this->escape($value).")";
                    } else {
                        $cond .= "=".$this->escape($value);
                    }
                }    
            } else if ($where === true) {
                $cond = "1=1";
            } else if (is_numeric($where)) {
                $cond = "id=".$this->escape($where);
            } else if (is_string($where)) {
                $cond = $where;
            } else {
                throw new Exception("Where is invalid");
            }
            
            $sql = "UPDATE $table SET $columns WHERE $cond LIMIT $limit";
            
            return $sql;
        }
        
        /**
         * Suorittaa SQL - kyselyn.
         *
         * @param   string  $sql    SQL - kysely
         * @return  mixed
         */
        public function query($sql) {
            $result = false;
            
            if ($this->connect()) {
                $result = $this->_query($sql);
            }
            
            return $result;    
        }
        protected abstract function _query($sql);
        
        /**
         * Peruu transaktion.
         *
         * @return bool
         */
        public function rollback() {
            $result = false;
            
            if (!empty($this->_transactions)) {
                $savepoint = array_pop($this->_transactions);
                
                if (empty($savepoint)) {
                    $sql = "ROLLBACK";
                } else {
                    $sql = "ROLLBACK TO SAVEPOINT $savepoint";
                }
                
                $result = $this->query($sql);
                                
                if (!$result) {
                    $this->_transactions[] = $savepoint;
                }
            }
            
            return $result;
        }
    }