var path = require("path");
var ts = require(__dirname+
    path.sep+
    "jsTestSuite.js");
var cd = require(path.dirname(__dirname)+
    path.sep+
    "checkDigits"+
    path.sep+
    "jsCheckDigits.js");

var SPTestSuite = ts.SPTestSuite;
var SPCheckDigits = cd.SPCheckDigits;

try {
    // Testaa suomalainen kelvollinen konekielinen BBAN
    SPTestSuite.test("digits-1",function(){
        return SPCheckDigits.checkFIBBAN("159030776");
    },true);
    
    // Testaa suomalainen kelvollinen BBAN
    SPTestSuite.test("digits-1.1",function(){
        return SPCheckDigits.checkFIBBAN("159030-776");
    },true);
    
    // Testaa suomalainen epäkelpo konekielinen BBAN
    SPTestSuite.test("digits-1.2",function(){
        return SPCheckDigits.checkFIBBAN("15903072376");
    },false);
    
    // Testaa suomalainen epäkelpo BBAN
    SPTestSuite.test("digits-1.3",function(){
        return SPCheckDigits.checkFIBBAN("159030-72376");
    },false);
    
    // Testaa suomalainen kelvollinen Y-tunnus
    SPTestSuite.test("digits-2",function(){
        return SPCheckDigits.checkFIBusinessId("1738633-3");
    },true);
    
    // Testaa suomalainen epäkelpo Y-tunnus
    SPTestSuite.test("digits-2.1",function(){
        return SPCheckDigits.checkFIBusinessId("1737633-3");
    },false);
    
    // Testaa suomalainen kelvollinen viitenumero
    SPTestSuite.test("digits-3",function(){
        return SPCheckDigits.checkFIReference("42848");
    },true);
    
    // Testaa suomalainen epäkelpo viitenumero
    SPTestSuite.test("digits-3.1",function(){
        return SPCheckDigits.checkFIReference("42648");
    },false);
    
    // Testaa kelvollinen IBAN
    SPTestSuite.test("digits-4",function(){
        return SPCheckDigits.checkIBAN("VG60VLWA0096206253608550");
    },true);
    
    // Testaa epäkelpo IBAN
    SPTestSuite.test("digits-4.1",function(){
        return SPCheckDigits.checkIBAN("VG60V0WA0096206253608550");
    },false);
    
    // Testaa suomalainen kelvollinen HETU
    SPTestSuite.test("digits-5",function(){
        return SPCheckDigits.checkFIPersonId("271073-6808");
    },true);
    
    // Testaa suomalainen epäkelpo HETU
    SPTestSuite.test("digits-5.1",function(){
        return SPCheckDigits.checkFIPersonId("271083-6808");
    },false);
    
    // Testaa kelvollinen RF viite
    SPTestSuite.test("digits-6",function(){
        return SPCheckDigits.checkRFReference("RF84UNEA4CYDT0WNT26Y");
    },true);
    
    // Testaa epäkelpo RF viite
    SPTestSuite.test("digits-6.1",function(){
        return SPCheckDigits.checkRFReference("RF84U6EA4CYDT0WNT26Y");
    },false);
    
    // Luo suomalainen viitenumero
    var ref = null;
    SPTestSuite.test("digits-7",function(){
        ref = SPCheckDigits.createFIReference("12345");
        return String(ref).length;
    },6);
    
    // Tarkasta luotu viitenumero
    SPTestSuite.test("digits-7.1",function(){
        return SPCheckDigits.checkFIReference(ref);
    },true);
    
    // Luo suomalaisesta viitteestä RF viite
    var rfref = null;
    SPTestSuite.test("digits-8",function(){
        rfref = SPCheckDigits.createRFReference(ref);
        return String(rfref).length;
    },10);
    
    // Tarkasta luotu RF viite
    SPTestSuite.test("digits-8.1",function(){
        return SPCheckDigits.checkRFReference(rfref);
    },true);
    
    // Hae suomalaisen IBAN:n BIC
    SPTestSuite.test("digits-9",function(){
        return SPCheckDigits.getFIBIC("FI3715903000000776");
    },"NDEAFIHH");
} catch (err) {
    console.log(err);
}