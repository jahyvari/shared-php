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
var db = new db.SPMySQL();

co(function* (){        
    // Testaa yhteyden avaus
    var connect = yield db.connect();
    SPTestSuite.test("dbconn-1",function (){
        return connect;
    },true);
    
    // Testaa transaktion aloittaminen
    var begin = yield db.begin();
    SPTestSuite.test("dbconn-2",function (){
        return begin;
    },true);
    
    // Testaa INSERT
    var random = Math.floor((Math.random() * 100) + 1);
    var insertid = yield db.insert("test",{"key1" : random});
    SPTestSuite.test("dbconn-3",function (){
        return Boolean(insertid);
    },true);
    
    // Tarkasta tallentuiko data oikeasti
    var query = yield db.preparedQuery("SELECT * FROM test WHERE id=:id",{"id" : insertid});
    SPTestSuite.test("dbconn-4",function (){
        if (query["resultset"].length > 0) {
            return query["resultset"][0]["key1"];   
        } else {
            return false;
        }        
    },random);
    
    // Aloita sisäkkäinen transaktio
    var savepoint = yield db.begin();
    SPTestSuite.test("dbconn-5",function (){
        return savepoint;
    },true);
    
    // Muuta key1 sarakkeen arvoa
    var newVal = random+"a";
    var affrows = yield db.update("test",{"key1" : newVal},insertid);
    SPTestSuite.test("dbconn-6",function (){
        return affrows;
    },1);
    
    // Tarkasta muuttuiko data oikeasti
    var query = yield db.preparedQuery("SELECT * FROM test WHERE id=:id",{"id" : insertid});
    SPTestSuite.test("dbconn-7",function (){
        if (query["resultset"].length > 0) {
            return query["resultset"][0]["key1"];   
        } else {
            return false;
        }        
    },newVal);
    
    // Peru sisäkkäinen transaktio
    var rollback = yield db.rollback();
    SPTestSuite.test("dbconn-8",function (){
        return rollback;
    },true);    
    
    // Tarkasta menikö rollback oikeasti läpi
    var query = yield db.preparedQuery("SELECT * FROM test WHERE id=:id",{"id" : insertid});
    SPTestSuite.test("dbconn-9",function (){
        if (query["resultset"].length > 0) {
            return query["resultset"][0]["key1"];   
        } else {
            return false;
        }        
    },random);
    
    // Hyväksy muutokset
    var commit = yield db.commit();
    SPTestSuite.test("dbconn-10",function (){
        return commit;
    },true);
    
    // Tarkasta että virheellinen SQL lause ei mene läpi
    var query = yield db.query("SELECT * FROM test2");
    SPTestSuite.test("dbconn-11",function (){
        return query["resultset"].length;   
    },0);
    
    // Tarkasta että edellinen lause palautti virheilmoituksen
    SPTestSuite.test("dbconn-12",function (){
        return Boolean(query["error"].length);   
    },true);
    
    // Testaa yhteyden sulkeminen
    var disconnect = yield db.disconnect();
    SPTestSuite.test("dbconn-13",function (){
        return disconnect;
    },true);
})();