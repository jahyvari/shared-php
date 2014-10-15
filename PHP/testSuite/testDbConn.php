<?php        
    require_once(__DIR__.DIRECTORY_SEPARATOR."config.php");    
    require_once(dirname(__DIR__).
        DIRECTORY_SEPARATOR.
        "dbConn".
        DIRECTORY_SEPARATOR.
        "classDB.php"
    );
    
    use SharedPHP\TestSuite;
    use SharedPHP\DB;
            
    # Tarkasta yhteyden avaus
    TestSuite::test("dbconn-1",function(){
        DB::open("conn1");        
        return DB::connect();
    },true);
    
    # Tarkasta yhteyden sulkeminen
    TestSuite::test("dbconn-1.1",function(){
        DB::disconnect();
        return db::get("connected");
    },false);
    
    # Aloita transaktio
    TestSuite::test("dbconn-2",function(){
        return DB::begin();
    },true);
    
    # Tarkasta normaali INSERT
    $uniqid = uniqid();
    $insertid = null;
    TestSuite::test("dbconn-2.1",function() use ($uniqid,&$insertid){
        $insertid = DB::insert("test",array("key1" => $uniqid));
        return $insertid;
    },true);
    
    # Tarkasta INSERT lause SELECT haulla
    $query = null;
    TestSuite::test("dbconn-2.2",function() use ($insertid,&$query){
        $query = DB::preparedQuery("SELECT key1 FROM test WHERE id=:id",array(
            "id" => $insertid
        ));
        return DB::numRows($query);
    },1);
    
    # Testaa tuloksen muistin vapautus
    TestSuite::test("dbconn-2.3",function() use ($query){
        return DB::freeResult($query);
    },null);
        
    # Aloita sisäkkäinen transaktio
    TestSuite::test("dbconn-3",function(){
        return DB::begin();
    },true);
            
    # Testaa normaali UPDATE
    $uniqid .= "a1";
    TestSuite::test("dbconn-3.1",function() use ($uniqid,$insertid){
        return DB::update("test",array("key1" => $uniqid),$insertid);
    },1);
    
    # Testaa UPDATE lause SELECT haulla
    TestSuite::test("dbconn-3.2",function() use ($insertid){
        $query = DB::preparedQuery("SELECT key1 FROM test WHERE id=:id",array(
            "id" => $insertid
        ));
        return DB::fetchAll($query)[0]["key1"];
    },$uniqid);
    
    # Peru sisäkkäinen transaktio
    TestSuite::test("dbconn-3.3",function(){
        return DB::rollback();
    },true);
    
    # Commitoi loput muutokset
    TestSuite::test("dbconn-3.3",function(){
        return DB::commit();
    },true);
    
    # Testaa että transaktion peruminen onnistui
    $uniqid = mb_substr($uniqid,0,-2);
    TestSuite::test("dbconn-3.4",function() use ($insertid){
        $query = DB::select("SELECT key1 FROM test WHERE id=:id",array(
            "id" => $insertid
        ));
        foreach ($query as $row) {
            return $row["key1"];
        }
        return false;
    },$uniqid);
        
    # Testaa virhepalaute
    TestSuite::test("dbconn-4",function(){
        $query = DB::query("SELECT key2 FROM test WHERE id=1");
        return DB::errno();
    },1054);
    
    TestSuite::test("dbconn-4.1",function(){
        return DB::error();
    },true);