<?php
    require_once(__DIR__."/classMysqliConn.php");
    require_once(__DIR__."/classPDOConn.php");
    
    class DB {
        private static $_conn = null;
        private static $_connections = array();
        
        private static function _getConn() {
            if (!isset(self::$_connections[self::$_conn])) {
                throw new Exception("Database connection is not set");
            }
            return self::$_connections[self::$_conn];
        }
        
        public static function change($name) {
            if (!isset(self::$_connections[$name])) {
                throw new Exception("Unknown database connection $name");
            }
            self::$_conn = $name;
            return true;
        }
        
        public static function open($name,$driver,$data = array()) {            
            if (!$name) {
                throw new Exception("Invalid database connection name $name");
            }
            
            if (!isset(self::$_connections[$name])) {
                switch ($driver) {
                    # MySQLi
                    case "mysqli":
                        self::$_connections[$name] = new MysqliConn($data);
                        break;
                    
                    # PDO
                    case "mysql": # MySQL                
                    case "pgsql": # PgSQL                    
                    case "sqlite": # SQLite
                        self::$_connections[$name] = new PDOConn($driver,$data);
                        break;
                    
                    default:
                        throw new Exception("Invalid driver $driver");
                }
            }            
            self::$_conn = $name;
            return true;
        }                
        
        public static function affectedRows() {
            return self::_getConn()->affectedRows();
        }
        
        public static function begin() {
            return self::_getConn()->begin();
        }
        
        public static function commit() {
            return self::_getConn()->commit();
        }
                        
        public static function connect() {
            return self::_getConn()->connect();
        }
        
        public static function connectErrno() {
            return self::_getConn()->connectErrno();
        }
        
        public static function connectError() {
            return self::_getConn()->connectError();
        }
        
        public static function dataSeek($query,$offset) {
            return self::_getConn()->dataSeek($query,$offset);
        }
        
        public static function disconnect() {
            return self::_getConn()->disconnect();
        }
        
        public static function errno() {
            return self::_getConn()->errno();
        }
        
        public static function error() {
            return self::_getConn()->error();
        }
        
        public static function escape($value) {
            return self::_getConn()->escape($value);
        }
        
        public static function escapeString($value) {
            return self::_getConn()->escapeString($value);
        }
        
        public static function fetch($query,$resulttype = null,$offset = null) {
            return self::_getConn()->fetch($query,$resulttype,$offset);
        }
        
        public static function fetchAll($query,$resulttype = null) {
            return self::_getConn()->fetchAll($query,$resulttype);
        }
        
        public static function fetchAssoc($query,$offset = null) {
            return self::_getConn()->fetchAssoc($query,$offset);
        }
        
        public static function freeResult($query) {
            return self::_getConn()->freeResult($query);
        }
        
        public static function get($name) {
            return self::_getConn()->__get($name);
        }
        
        public static function insert($table,$data) {
            return self::_getConn()->insert($table,$data);
        }
        
        public static function insertId() {
            return self::_getConn()->insertId();
        }
        
        public static function insertStr($table,$data) {
            return self::_getConn()->insertStr($table,$data);
        }
        
        public static function numRows($query) {
            return self::_getConn()->numRows($query);
        }
        
        public static function preparedQuery($sql,$params = array()) {
            return self::_getConn()->preparedQuery($sql,$params);
        }
        
        public static function result($query,$offset,$field = 0) {
            return self::_getConn()->result($query,$offset,$field);
        }
        
        public static function select($sql,$params = array(),$resulttype = null) {
            return self::_getConn()->select($sql,$params,$resulttype);
        }
        
        public static function set($name,$value) {
            return self::_getConn()->__set($name,$value);
        }
        
        public static function update($table,$data,$where,$limit = 1) {
            return self::_getConn()->update($table,$data,$where,$limit);
        }
        
        public static function updateStr($table,$data,$where,$limit = 1) {
            return self::_getConn()->updateStr($table,$data,$where,$limit);
        }
        
        public static function query($sql) {
            return self::_getConn()->query($sql);
        }
        
        public static function rollback() {
            return self::_getConn()->rollback();
        }
    }