var fs = require("fs");
var path = require("path");

eval(fs.readFileSync(__dirname+
    path.sep+
    "jsTestSuite.js").toString()
);
eval(fs.readFileSync(path.dirname(__dirname)+
    path.sep+
    "checkDigits"+
    path.sep+
    "jsCheckDigits.js").toString()
);

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
} catch (err) {
    console.log(err);
}