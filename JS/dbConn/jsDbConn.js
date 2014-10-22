function SPDbConn (data) {
    var _this = this;
        
    // Julkiset attribuutit
    this.connected      = false;
    this.connectError   = "";
    this.database       = null;
    this.host           = null;
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
     * Yhdistää tietokantaan. Virhetilanteessa funktio nostaa keskeytyksen.
     *
     * @param   function    callback    Funktio joka ajetaan onnistuneen yhdistämisen jälkeen (vapaaehtoinen)
     */
    this.connect = function(callback) {
        if (!_this.connected) {
            _this._connect(function(){
                if (_this.connectError == "") {
                    _this.connected = true;
                    
                    if (typeof callback == "function") {
                        callback.call(_this);
                    }
                } else {
                    throw _this.connectError;
                }
            });
        } else if (typeof callback == "function") {
            callback.call(_this);
        }
    }
    this._connect = function(callback) {
        throw "_connect not implemented!";
    }
    
    /**
     * Suorittaa SQL kyselyn tietokantaan.
     *
     * @param   string      sql         SQL kysely
     * @param   function    callback    Funktio joka ajetaan kyselyn päätteeksi
     */
    this.query = function(sql,callback) {
        _this.connect(function(){
            _this._query(sql,function(errno,error,result){
                if (typeof callback == "function") {
                    // FIXME: Kutsu callback funktiota
                }
            });
        });
    }
    this._query = function(sql,callback) {
        throw "_query not implemented!";
    }
}

function SPMySQL (data) {
    var _this = this;
    var _mysql = require("mysql");
    
    SPDbConn.call(_this,data);
        
    this._connect = function(callback) {
        _this.link = _mysql.createConnection({
            host        : _this.host,
            user        : _this.username,
            password    : _this.passwd,
            database    : _this.database,
            port        : _this.port,
            timeout     : _this.timeout
        });
        
        _this.link.connect(function(err){
            if (err) {
                _this.connectError = err.code;
            }            
            callback.call(_this);
        });        
    }
    
    this._query = function(sql,callback) {
        _this.link.query(sql,function(err,result){
            var errno = 0;
            var error = "";
            var _result = {};
            
            if (err) {
                errno = err.errno;
                error = err.code;                
            } else {
                _result = result;
            }
            
            callback.call(_this,errno,error,_result);
            
            // FIXME: Luo disconnect metodi
            _this.link.end();
        });
    }
}
SPMySQL.prototype = Object.create(SPDbConn.prototype);
SPMySQL.prototype.constructor = SPMySQL;

// Node.js export
module.exports.SPMySQL = SPMySQL;