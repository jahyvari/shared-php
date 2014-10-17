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
} catch (err) {
    console.log(err);
}