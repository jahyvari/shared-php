<?php        
    require_once(__DIR__.DIRECTORY_SEPARATOR."config.php");
    require_once(dirname(__DIR__).
        DIRECTORY_SEPARATOR.
        "checkDigits".
        DIRECTORY_SEPARATOR.
        "classCheckDigits.php"
    );
    
    # Tarkasta kelvollinen suomalainen BBAN    
    TestSuite::test("digits-1",function(){
        return CheckDigits::checkFIBBAN("159030776");
    },true);
    
    # Tarkasta epäkelpo suomalainen BBAN    
    TestSuite::test("digits-2",function(){
        return CheckDigits::checkFIBBAN("15903072376");
    },false);
    
    # Tarkasta kelvollinen suomalainen HETU
    TestSuite::test("digits-3",function(){
        return CheckDigits::checkFIPersonId("131052-308T");
    },true);
    
    # Tarkasta epäkelo suomalainen HETU
    TestSuite::test("digits-4",function(){
        return CheckDigits::checkFIPersonId("131062-308T");
    },false);
    
    # Tarkasta kelvollinen suomalainen Y-tunnus
    TestSuite::test("digits-5",function(){
        return CheckDigits::checkFIBusinessId("0737546-2");
    },true);
    
    # Tarkasta epäkelo suomalainen Y-tunnus
    TestSuite::test("digits-6",function(){
        return CheckDigits::checkFIBusinessId("0737547-2");
    },false);
    
    # Tarkasta kelvollinen IBAN
    TestSuite::test("digits-7",function(){
        return CheckDigits::checkIBAN("FI3715903000000776");
    },true);
    
    # Tarkasta epäkelo IBAN
    TestSuite::test("digits-8",function(){
        return CheckDigits::checkIBAN("FI3515903000000776");
    },false);
                    
    # Tarkasta kelvollinen RF viite
    TestSuite::test("digits-9",function(){
        return CheckDigits::checkRFReference("RF97C2H5OH");
    },true);
    
    # Tarkasta epäkelo RF viite
    TestSuite::test("digits-10",function(){
        return CheckDigits::checkRFReference("RF97C3H5OH");
    },false);
    
    # Tarkasta kelvollinen suomalainen viite
    TestSuite::test("digits-11",function(){
        return CheckDigits::checFIReference("6174354");
    },true);
    
    # Tarkasta epäkelo suomalainen viite
    TestSuite::test("digits-12",function(){
        return CheckDigits::checFIReference("6174334");
    },false);