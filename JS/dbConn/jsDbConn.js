function SPDbConn (data) {
    var _this = this;
        
    // Julkiset attribuutit
    this.affrows        = 0;
    this.connected      = false;
    this.connectError   = "";
    this.database       = null;
    this.errno          = 0;
    this.error          = "";
    this.host           = null;
    this.insertId       = 0;
    this.link           = null;
    this.passwd         = null;
    this.port           = null;
    this.timeout        = null;
    this.username       = null;
    
    if (typeof data == "object") {
        for (key in data) {
            if (_this.hasOwnProperty(key)) {
                _this[key] = data[key];
            } else {
                throw "Unknown key "+key;
            }
        }
    }
    
    /**
     * Yhdistää tietokantaan.
     *
     * @returns bool
     */
    this.connect = function* () {
        var result = false;
        if (!_this.connected) {
            result = yield _this._connect();
            if (result) {
                _this.connected = true;
            }
        } else {
            result = true;
        }
        return result;
    }
    this._connect = function* () {
        throw "_connect() not implemented!";
    }
    
    /**
     * Katkaisee yhteyden tietokantaan.
     *
     * @returns bool
     */
    this.disconnect = function* () {
        var result = false;
        if (_this.connected) {
            result = yield _this._disconnect();
            if (result) {
                _this.affrows       = 0;
                _this.connected     = false;
                _this.connectError  = "";                
                _this.errno         = 0;
                _this.error         = "";
                _this.insertId      = 0;
            }
        }
        return result;
    }
    this._disconnect = function* () {
        throw "_disconnect() not implemented!";
    }
    
    /**
     * Funktio tekee parametristä tietoturvallisen
     * SQL - injektioiden varalta.
     *
     * Parametri voi olla taulukko jolloin taulukon
     * arvot palautetaan pilkulla eroteltuina.
     *
     * NULL parametri palautetaan merkkijonona "NULL".
     *
     * Boolean parametri muutetaan arvoon 1 tai 0.
     *
     * Päivämääräobjekti muutetaan Y-m-d muotoon.
     *
     * Numeerisessa ja merkkijonossa asetetaan ' - merkit
     * parametrin ympärille ja ajetaan parametri _escapeString()
     * funktion läpi.
     *
     * Muissa tietotyypeissä nostetaan keskeytys.
     * 
     * @param   mixed   val     Parametri
     * @returns string
     */
    this.escape = function(val) {
        var result = false;
        
        switch (typeof val) {
            case "boolean":
                result = ((result) ? "1" : "0");
                break;
                        
            case "number":
            case "string":
                result = "'"+_this.escapeString(val.toString())+"'";
                break;
            
            case "object":
                if (val === null) {
                    result = "NULL";
                } else {
                    if (val instanceof Date) {
                        var year = val.getFullYear();
                        var month = val.getMonth()+1;
                        var date = val.getDate();
                        
                        if (month < 10) {
                            month = "0"+month;
                        }
                        if (date < 10) {
                            date = "0"+date;
                        }
                        
                        result = year+"-"+month+"-"+date;
                    } else if (val instanceof Array) {
                        if (val.length > 0) {
                            for (i in val) {
                                if (result === false) {
                                    result = "";
                                }                            
                                result += ((result.length > 0) ? ", " : "")+
                                    _this.escape(val[i]);
                            }
                        } else {
                            throw "Val is an empty array!";
                        }
                    } else {
                        throw "Unsupported object!";
                    }
                }
                break;
                        
            default:
                throw "Unsupported escape type "+typeof val+"!";
                break;
        }
        
        return result;
    }
    
    /**
     * Ajaa parametrin escape funktion läpi.
     *
     * @param   string  val     Parametri
     * @returns mixed
     */
    this.escapeString = function* (val) {
        var result = false;
        if (yield _this.connect()) {
            result = _this._escapeString(val);
        }
        return result;
    }
    this._escapeString = function(val) {
        throw "_escapeString() not implemented!";
    }
    
    /**
     * Suorittaa SQL kyselyn tietokantaan ja palauttaa kyselyn tulosjoukon.
     *
     * Jos kysely ei palauta tulosjoukkoa palautetaan boolean true.
     *
     * @param   string  sql SQL kysely
     * @returns mixed
     */
    this.query = function* (sql) {
        var result = false;
        
        _this.affrows   = 0;        
        _this.errno     = 0;
        _this.error     = "";
        _this.insertId  = 0;
        
        if (yield _this.connect()) {
            result = yield _this._query(sql);
        }
        return result;
    }
    this._query = function* (sql,callback) {
        throw "_query() not implemented!";
    }
}

function SPMySQL (data) {
    var _this = this;
    var _mysql = require("mysql");
    
    SPDbConn.call(_this,data);
        
    this._connect = function* (){
        var result = false;
        
        _this.link = _mysql.createConnection({
            host        : _this.host,
            user        : _this.username,
            password    : _this.passwd,
            database    : _this.database,
            port        : _this.port,
            timeout     : _this.timeout
        });
        
        var connect = function() {
            return function(callback) {
                _this.link.connect(callback);
            }
        }        
                
        try {
            yield connect();
            result = true;
        } catch(e) {
            _this.connectError = e.code;
        }
        
        return result;
    }
    
    this._disconnect = function* (callback) {
        var result = false;
        
        var disconnect = function() {
            return function(callback) {
                _this.link.end(callback);
            }
        }
                        
        try {
            yield disconnect();
            result = true;
        } catch(e) {
            // NOPE
        }
        
        return result;
    }
    
    this._escapeString = function(val) {
        var result = _this.link.escape(val);
        if (/^'[\S\s]{1,}'$/.test(result)) {
            result = result.slice(1,-1);
        }
        return result;
    }
    
    this._query = function* (sql) {
        var result = false;
        
        var query = function(sql) {
            return function(callback) {
                _this.link.query(sql,callback);
            }
        }
            
        try {
            var query = yield query(sql);
            
            if (/^(delete|insert|replace|update)/i.test(sql.trim())) {
                if (query[0].hasOwnProperty("affectedRows")) {
                    _this.affrows = query[0].affectedRows;
                }
                if (query[0].hasOwnProperty("insertId")) {
                    _this.insertId = query[0].insertId;
                }
                result = true;
            } else {
                result = query[0];
            }
        } catch(e) {
            _this.errno = err.errno;
            _this.error = err.code;                
        }
                
        return result;
    }
}
SPMySQL.prototype = Object.create(SPDbConn.prototype);
SPMySQL.prototype.constructor = SPMySQL;

// Node.js export
module.exports.SPMySQL = SPMySQL;