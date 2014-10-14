<?php        
    require_once(__DIR__.DIRECTORY_SEPARATOR."config.php");
    require_once(dirname(__DIR__).
        DIRECTORY_SEPARATOR.
        "checkDigits".
        DIRECTORY_SEPARATOR.
        "classCheckDigits.php"
    );
    
    # Muuta collection kansiossa oleva tiedosto taulukoksi
    function _collectionToArr($name) {
        $result = array();        
        $file = __DIR__.
            DIRECTORY_SEPARATOR.
            "collection".
            DIRECTORY_SEPARATOR.
            $name;
            
        if (file_exists($file)) {
            $result = file($file,FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        }
        
        return $result;
    }
    
    # Ajaa collection kansiossa oleva tiedostot testifunktiota vastaan
    function _testCollection($name,$function,$expected = true) {
        $result = !$expected;
        
        if (method_exists("CheckDigits",$function)) {
            foreach (_collectionToArr($name) as $row) {
                $result = CheckDigits::$function(trim($row));
                if ($result !== $expected) {
                    break;
                }
            }
        }
        
        return $result;
    }
        
    # Tarkasta kelvollinen suomalainen BBAN    
    TestSuite::test("digits-1",function(){
        return CheckDigits::checkFIBBAN("159030776");
    },true);
    
    # Tarkasta kelvollinen suomalainen BBAN (esitysmuotoinen)
    TestSuite::test("digits-1.1",function(){
        return CheckDigits::checkFIBBAN("159030-776");
    },true);
    
    # Tarkasta epäkelpo suomalainen BBAN    
    TestSuite::test("digits-2",function(){
        return CheckDigits::checkFIBBAN("15903072376");
    },false);
    
    # Tarkasta epäkelpo suomalainen BBAN (esitysmuotoinen)   
    TestSuite::test("digits-2.1",function(){
        return CheckDigits::checkFIBBAN("159030-72376");
    },false);
    
    # Tarkasta 100 kappaletta suomalaisia kelvollisia henkilötunnuksia
    TestSuite::test("digits-3",function(){        
        return _testCollection("fi_person_id.txt","checkFIPersonId");
    },true);
    
    # Tarkasta epäkelpo suomalainen HETU
    TestSuite::test("digits-4",function(){
        return CheckDigits::checkFIPersonId("131062-308T");
    },false);
    
    # Tarkasta 100 kappaletta suomalaisia kelvollisia Y-tunnuksia
    TestSuite::test("digits-5",function(){
        return _testCollection("fi_business_id.txt","checkFIBusinessId");
    },true);
        
    # Tarkasta epäkelpo suomalainen Y-tunnus
    TestSuite::test("digits-6",function(){
        return CheckDigits::checkFIBusinessId("0737547-2");
    },false);
    
    # Tarkasta joukko kelvollisia IBAN tilinumeroita
    TestSuite::test("digits-7",function(){
        return _testCollection("iban.txt","checkIBAN");
    },true);
    
    # Tarkasta epäkelpo IBAN
    TestSuite::test("digits-8",function(){
        return CheckDigits::checkIBAN("FI3515903000000776");
    },false);
                    
    # Tarkasta 100 kappaletta RF viitteitä
    TestSuite::test("digits-9",function(){
        return _testCollection("rf_reference.txt","checkRFReference");
    },true);
    
    # Tarkasta epäkelpo RF viite
    TestSuite::test("digits-10",function(){
        return CheckDigits::checkRFReference("RF97C3H5OH");
    },false);
        
    # Tarkasta 100 kappaletta suomalaisia kelvollisia viitteitä
    TestSuite::test("digits-11",function(){
        return _testCollection("fi_reference.txt","checkFIReference");
    },true);
        
    # Tarkasta epäkelpo suomalainen viite
    TestSuite::test("digits-12",function(){
        return CheckDigits::checkFIReference("6174334");
    },false);
    
    # Tarkasta kelvollinen EAN-8
    TestSuite::test("digits-13",function(){
        return CheckDigits::checkEANCode("73513537");
    },true);
    
    # Tarkasta epäkelpo EAN-8
    TestSuite::test("digits-14",function(){
        return CheckDigits::checkEANCode("73512537");
    },false);
    
    # Tarkasta 100 kappaletta EAN-13 koodeja
    TestSuite::test("digits-15",function(){
        return _testCollection("ean_13.txt","checkEANCode");
    },true);
    
    # Tarkasta epäkelpo EAN-13
    TestSuite::test("digits-16",function(){
        return CheckDigits::checkEANCode("4002381333931");
    },false);
    
    # Tarkasta kelvollinen EAN-14
    TestSuite::test("digits-17",function(){
        return CheckDigits::checkEANCode("11234567890125");
    },true);
    
    # Tarkasta epäkelpo EAN-14
    TestSuite::test("digits-18",function(){
        return CheckDigits::checkEANCode("12234567890125");
    },false);
    
    # Luo suomalainen viitenumero
    $reference = null;
    TestSuite::test("digits-19",function() use (&$reference){
        $reference = CheckDigits::createFIReference("12345");
        return strlen($reference);
    },6);
    
    # Testaa luotu viitenumero
    TestSuite::test("digits-19.1",function() use ($reference){
        return CheckDigits::checkFIReference($reference);
    },true);
    
    # Luo suomalaisesta viitteesta RF viite
    $rfreference = null;
    TestSuite::test("digits-20",function() use ($reference,&$rfreference){
        $rfreference = CheckDigits::createRFReference($reference);
        return strlen($rfreference);
    },10);
        
    # Tarkasta luotu RF viite
    TestSuite::test("digits-20.1",function() use ($rfreference){
        return CheckDigits::checkRFReference($rfreference);
    },true);
    
    # Hae suomalaisen IBAN:n BIC
    TestSuite::test("digits-21",function(){
        return strlen(CheckDigits::getFIBic("FI3715903000000776"));
    },8);