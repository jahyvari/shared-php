var path = require("path");
var ts = require(__dirname+
    path.sep+
    "jsTestSuite.js");
var uc = require(path.dirname(__dirname)+
    path.sep+
    "unitConverter"+
    path.sep+
    "jsUnitConverter.js");

var SPTestSuite = ts.SPTestSuite;
var SPUnitConverter = uc.SPUnitConverter;

try {
    // Muuta senttimeteri jaloiksi
    var cm = 180;
    var foot = null;
    SPTestSuite.test("unitconv-1",function(){
        foot = SPUnitConverter.cmToFoot(cm);
        return foot;
    },(cm*0.393700787/12));
        
    // Muuta jalat tuumiksi
    var inch = null;
    SPTestSuite.test("unitconv-1.1",function(){
        inch = SPUnitConverter.footToInch(foot);
        return inch;
    },(foot*12));
    
    // Muuta tuumat senttimetreiksi
    SPTestSuite.test("unitconv-1.2",function(){
        return SPUnitConverter.inchToCm(inch);
    },cm);
    
    // Muuta jalat senttimetreiksi
    SPTestSuite.test("unitconv-1.3",function(){
        return SPUnitConverter.footToCm(foot);
    },cm);
    
    // Muuta kilogrammat paunoiksi
    var kg = 1;
    var lb = null;
    SPTestSuite.test("unitconv-2",function(){
        lb = SPUnitConverter.kgToLb(kg);
        return lb;
    },(kg*2.20462262));
    
    // Muuta paunat kilogrammoiksi
    SPTestSuite.test("unitconv-2.1",function(){
        return SPUnitConverter.lbToKg(lb);
    },kg);
} catch (err) {
    console.log(err);
}