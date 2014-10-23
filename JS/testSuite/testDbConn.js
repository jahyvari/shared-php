var path = require("path");
var co = require("co");
var ts = require(__dirname+
    path.sep+
    "jsTestSuite.js");
var db = require(path.dirname(__dirname)+
    path.sep+
    "dbConn"+
    path.sep+
    "jsDbConn.js");

var SPTestSuite = ts.SPTestSuite;
var db = new db.SPMySQL({
    "host"      : "localhost",
    "username"  : "username",
    "passwd"    : "password",
    "database"  : "test"
});

co(function* (){            
    // Testaa yhteyden avaus
    var open = yield db.connect();
    SPTestSuite.test("dbconn-1",function (){
        return open;
    },true);
    
    // Testaa yhteyden sulkeminen
    var close = yield db.disconnect();
    SPTestSuite.test("dbconn-2",function (){
        return close;
    },true);
})();