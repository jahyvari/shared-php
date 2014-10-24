function SPDbConn (data) {
    var _this = this;
    var _fs = require("fs");
    var _path = require("path");
        
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
    
    if (typeof data == "undefined") {
        data = {};
        
        var file = (process.env.HOME ||
            process.env.HOMEPATH ||
            process.env.USERPROFILE)+
            _path.sep+
            ".dbconn";
        
        if (_fs.existsSync(file)) {
            var rows = _fs.readFileSync(file,{"encoding" : "utf-8"}).split("\n");
            for (i in rows) {
                var val = rows[i].trim().split("=");
                if (val.length == 2) {
                    data[val[0].trim()] = val[1].
                        trim().
                        replace(/([\"\']?)(\w+)([\"\']?)/,"$2");
                }
            }
        }
    }
    
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
    this.escape = function* (val) {
        var result = false;
        
        switch (typeof val) {
            case "boolean":
                result = ((result) ? "1" : "0");
                break;
                        
            case "number":
            case "string":
                result = "'"+(yield _this.escapeString(val.toString()))+"'";
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
                                    (yield _this.escape(val[i]));
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
     * Ajaa INSERT kyselyn ja palauttaa insert id:n.
     *
     * @param   string  table   Taulu jonne tallennetaan
     * @param   array   data    Arvot jotka tallennetaan
     * @returns int
     */
    this.insert = function* (table,data) {
        var sql = yield _this.insertStr(table,data);
                
        yield _this.query(sql);
        
        return _this.insertId;
    }
    
    /**
     * Luo INSERT kyselyn SQL - lauseen funktion parametrien
     * avulla.
     *
     * @param   string  table   Taulu jonne tallennetaan
     * @param   array   data    Arvot jotka tallennetaan
     * @returns string
     */
    this.insertStr = function* (table,data) {
        if (typeof table != "string" || table.length == 0) {
            throw "Table name is missing!";
        }
        
        if (typeof data != "object") {
            throw "Data is not an object!";
        }
        
        var keys = "";
        var values = "";
        for (key in data) {
            keys += ((keys) ? ", ": "")+key;
            values += ((values) ? ", ": "")+(yield _this.escape(data[key]));
        }
        
        if (!keys) {
            throw "Data is empty!";
        }
                
        return "INSERT INTO "+table+" ("+keys+") VALUES ("+values+")";
    }
    
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
     * @param   string  sql     SQL lause
     * @param   array   params  Parametrit (vapaaehtoinen)
     * @returns mixed
     */
    this.preparedQuery = function* (sql,params) {
        var result = false;
        
        if (typeof sql == "string" && sql.length > 0) {
            sql += " ";
            
            if (typeof params == "object" && Object.keys(params).length > 0) {
                var bind = {};                
                
                for (key in params) {
                    var escaped = key.replace(/([.*+?^${}()|\[\]\/\\])/g,"\\$1");
                    var regExp = new RegExp("[:]{1}"+escaped+"[\r\n), ]{1}","gm");
                    var count = 0;
                    while (match = regExp.exec(sql)) {
                        bind[match["index"]] = [(match[0].length-1),params[key]];                        
                        count++;
                    }
                    if (count == 0) {
                        throw "Cannot find key "+key+"!";
                    }
                }
                
                var replaced = 0;
                var keys = Object.keys(bind);
                for (i in keys) {
                    var pos = parseInt(keys[i]);
                    var value = yield _this.escape(bind[pos][1]);
                    
                    sql = sql.slice(0,(pos-replaced))+
                        value+
                        sql.slice((pos+bind[pos][0]-replaced));
                        
                    replaced += (bind[pos][0]-value.length);
                }
            }
           
            result = yield _this.query(sql.slice(0,-1));
        }
        
        return result;
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
    
    /**
     * Ajaa UPDATE kyselyn ja palauttaa affected rows:n.
     *
     * @param   string  table   Taulu jota päivitetään
     * @param   array   data    Arvot jotka päivitetään
     * @param   mixed   where   Rajoitusehdot
     * @param   int     limit   Montako riviä päivitetään
     * @returns string
     */
    this.update = function* (table,data,where,limit) {
        var sql = yield _this.updateStr(table,data,where,limit);
        
        yield _this.query(sql);
        
        return _this.affrows;
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
     * @param   string  table   Taulu jota päivitetään
     * @param   array   data    Arvot jotka päivitetään
     * @param   mixed   where   Rajoitusehdot
     * @param   int     limit   Montako riviä päivitetään
     * @returns string
     */
    this.updateStr = function* (table,data,where,limit) {
        if (typeof limit == "undefined") {
            limit = 1;
        }
        
        if (typeof table != "string" || table.length == 0) {
            throw "Table name is missing!";
        }
        
        if (typeof data != "object") {
            throw "Data is not an object!";
        }
        
        if (!/^[0-9]{1,}$/.test(limit)) {
            throw "Limit is not numeric!";
        }
        
        var columns = "";
        for (key in data) {
            columns += ((columns) ? ", " : "");
            columns += key+"="+(yield _this.escape(data[key]));
        }
        
        var cond = "";
        if (/^[0-9]{1,}$/.test(where)) {
            cond = "id="+(yield _this.escape(where));
        } else if (typeof where == "string") {
            cond = where;
        } else if (where === true) {
            cond = "1=1";
        } else if (typeof where == "object") {
            for (key in where) {
                cond += ((cond) ? " AND " : "");
                cond += key;
                
                if (where[key] === null) {
                    cond += " IS NULL";
                } else if (typeof where[key] == "object" && where[key] instanceof Array) {
                    cond += " IN ("+(yield _this.escape(where[key]))+")";
                } else {
                    cond += "="+(yield _this.escape(where[key]));
                }
            }
        }
        
        if (!cond) {
            throw "Where is invalid!";
        }
        
        return "UPDATE "+table+" SET "+columns+" WHERE "+cond+" LIMIT "+limit;
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
            _this.errno = e.errno;
            _this.error = e.code;                
        }
                
        return result;
    }
}
SPMySQL.prototype = Object.create(SPDbConn.prototype);
SPMySQL.prototype.constructor = SPMySQL;

// Node.js export
module.exports.SPMySQL = SPMySQL;