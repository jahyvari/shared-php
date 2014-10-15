<?php        
    require_once(__DIR__.DIRECTORY_SEPARATOR."config.php");
    require_once(dirname(__DIR__).
        DIRECTORY_SEPARATOR.
        "unitConverter".
        DIRECTORY_SEPARATOR.
        "classUnitConverter.php"
    );
    
    use SharedPHP\TestSuite;
    use SharedPHP\UnitConverter;
        
    # Muuta senttimeteri jaloiksi
    $cm = 180;
    $foot = null;
    TestSuite::test("unitconv-1",function() use ($cm,&$foot){
        $foot = UnitConverter::cmToFoot($cm);
        return $foot;
    },($cm*0.393700787/12));
        
    # Muuta jalat tuumiksi
    $inch = null;
    TestSuite::test("unitconv-1.1",function() use ($foot,&$inch){
        $inch = UnitConverter::footToInch($foot);
        return $inch;
    },($foot*12));
    
    # Muuta tuumat senttimetreiksi
    TestSuite::test("unitconv-1.2",function() use ($inch){
        return UnitConverter::inchToCm($inch);
    },$cm);
    
    # Muuta jalat senttimetreiksi
    TestSuite::test("unitconv-1.3",function() use ($foot){
        return UnitConverter::footToCm($foot);
    },$cm);
    
    # Muuta kilogrammat paunoiksi
    $kg = 1;
    $lb = null;
    TestSuite::test("unitconv-2",function() use ($kg,&$lb){
        $lb = UnitConverter::kgToLb($kg);
        return $lb;
    },($kg*2.20462262));
    
    # Muuta paunat kilogrammoiksi
    TestSuite::test("unitconv-2.1",function() use ($lb){
        return UnitConverter::lbToKg($lb);
    },$kg);