var SPTestSuite = new function() {
    var _this = this;
    var _sanityChk = false;
    
    /**
     * Funktio vertaa kahta taulukkoa toisiinsa.
     *
     * @param   array   arr1    1. taulukko
     * @param   array   arr2    2. taulukko
     * @param   bool    strict  TRUE = tiukka vertailu (identity),FALSE = löysä vertailu (equality) -> oletus
     * @returns bool
     */
    var _arrayCompare = function(arr1,arr2,strict) {
        if (strict == "undefined") {
            strict = false;
        }
                
        // Molemmat muuttujat tulee olla taulukoita        
        if (!_isArray(arr1) || !_isArray(arr2)) {
            return false;
        }
        
        // Taulukoiden pituus ei täsmää
        if (arr1.length != arr2.length) {
            return false;
        }
                
        var length = arr1.length;
        for (var i = 0; i < length; i++) {
            if (typeof arr1[i] == "object" && typeof arr2[i] == "object") {
                if (!_objectCompare(arr1[i],arr2[i],strict)) {
                    return false;
                }
            } else if (strict && arr1[i] !== arr2[i]) {
                return false;
            } else if (!strict && arr1[i] != arr2[i]) {
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Funktion avulla voidaan verrata täsmääkö kaksi muuttujaa toisiinsa.
     * 
     * @param   mixed   expected    Odotettu paluuarvo
     * @param   mixed   result      Paluuarvo
     * @returns bool
     */
    var _compare = function(expected,result) {                                            
        // Arvot täsmäävät täysin
        if (expected === result) {
            return true;
        }
                
        var floatPattern = /^[0-9]{1,}(\.[0-9]{1,})?$/;
        var compare = false;
        var eType = typeof expected;
        var rType = typeof result;
        
        // Verrataan arvoja datatyypin konversion avulla
        switch (eType) {
            case "boolean": // Boolean
                if (rType == "boolean" || /^[01]{1}$/.test(result)) {
                    if (expected === Boolean(result)) {
                        compare = true;
                    }
                }                
                break;
            
            case "number": // Numero                
                if (floatPattern.test(result)) {
                    if (Math.abs(parseFloat(expected)-parseFloat(result)) < 0.0000000001) {
                        compare = true;
                    }
                } else if (rType == "boolean") {
                    compare = _compare(expected,Number(result));
                }
                break;
            
            case "string": // Merkkijono
                if (floatPattern.test(expected) && floatPattern.test(result)) {
                    compare = _compare(parseFloat(expected),parseFloat(result));
                } else if (rType == "boolean") {
                    compare = _compare(expected,((result) ? "1" : "0"));
                }
                break;
            
            case "object": // Objekti, esim. taulukko
                if (_objectCompare(expected,result)) {
                    compare = true;
                }
                break;
            
            default: // Muu tietotyyppi
                if (eType == rType && expected == result) {
                    compare = true;
                }
        }
        
        return compare;    
    }
    
    /**
     * Funktio testaa onko syötetty arvo taulukko.
     *
     * @returns bool
     */
    var _isArray = function(val) {
        var result = false;
        
        if (typeof val == "object" && val instanceof Array) {
            result = true;
        }
        
        return result;
    }
    
    /**
     * Funktio vertaa kahta objektia toisiinsa.
     *
     * @param   array   obj1    1. objekti
     * @param   array   obj2    2. objekti
     * @param   bool    strict  TRUE = tiukka vertailu (identity),FALSE = löysä vertailu (equality) -> oletus
     * @returns bool
     */
    var _objectCompare = function(obj1,obj2,strict) {
        // Molemmat muuttujat tulee olla objekteja
        if (typeof obj1 != "object" || typeof obj2 != "object") {
            return false;
        }
        
        // Objektit ovat eri luokkien ilmentymiä
        if (obj1.constructor.name != obj2.constructor.name) {
            return false;
        }
        
        // Molemmat muuttujat ovat samanlaisia taulukoita
        if (_arrayCompare(obj1,obj2,strict)) {
            return true;
        }
        
        // Verrataan onko objekteilla samat ominaisuudet
        for (prop in obj1) {
            if (!obj2.hasOwnProperty(prop)) {
                return false;
            }
        }
        
        // Verrataan ominaisuudet myös toisinpäin ja aloitetaan vertaamaan arvoja
        for (prop in obj2) {
            if (!obj1.hasOwnProperty(prop)) {
                return false;
            }
                        
            if (typeof obj1[prop] == "object" && typeof obj2[prop] == "object") {
                if (!_objectCompare(obj1[prop],obj2[prop],strict)) {
                    return false;
                }
            } else if (strict && obj1[prop] !== obj2[prop]) {
                return false;
            } else if (!strict && obj1[prop] != obj2[prop]) {
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Tarkasta _compare funktion kelvollisuus ja nosta keskeytys mikäli
     * funktio ei toimi halutulla tavalla.
     *
     * @returns bool
     */
    var _sanityCheck = function() {
        if (!_compare(true,true)) {
            throw "Sanity check true==true failed!";
        }
        
        if (!_compare(false,false)) {
            throw "Sanity check false==false failed!";
        }
        
        if (_compare(true,false)) {
            throw "Sanity check true==false failed!";
        }
        
        if (!_compare(1,1)) {
            throw "Sanity check 1==1 failed!";
        }
        
        if (!_compare(1,"1")) {
            throw "Sanity check 1=='1' failed!";
        }
        
        if (!_compare(1,true)) {
            throw "Sanity check 1==true failed!";
        }
        
        if (!_compare("1",true)) {
            throw "Sanity check '1'==true failed!";
        }
                        
        if (_compare(0,true)) {
            throw "Sanity check 0!=true failed!";
        }
                        
        if (_compare("0",true)) {
            throw "Sanity check '0'!=true failed!";
        }
        
        if (!_compare(0.5,0.5)) {
            throw "Sanity check 0.5==0.5 failed!";
        }
        
        if (!_compare(0.5,"0.5")) {
            throw "Sanity check 0.5=='0.5' failed!";
        }
        
        if (_compare(0.4,0.39999)) {
            throw "Sanity check 0.4!=0.39999 failed!";
        }
        
        if (!_compare(null,null)) {
            throw "Sanity check null==null failed!";
        }
        
        if (_compare(null,1)) {
            throw "Sanity check null!=1 failed!";
        }
                        
        if (!_compare([1],[1])) {
            throw "Sanity check [1]==[1] failed!";
        }
        
        if (_compare([1],[2])) {
            throw "Sanity check [1]!=[2] failed!";
        }
        
        if (_compare([1,2],[2,1])) {
            throw "Sanity check [1,2]!=[2,1] failed!";
        }
        
        if (!_compare({"b" : 2,"a" : 1},{"a" : "1","b" : 2})) {
            throw "Sanity check {'b' : 2,'a' : 1}=={'a' : '1','b' : 2} failed!";
        }
        
        if (!_compare(SPTestSuite,SPTestSuite)) {
            throw "Sanity check SPTestSuite==SPTestSuite failed!";
        }
        
        if (_compare(SPTestSuite,{1 : 2})) {
            throw "Sanity check SPTestSuite!={1 : 2} failed!";
        }
    
        return true;    
    }
    
    /**
     * Funktion avulla voidaan testata palauttaako anymyymina funktiona
     * syötetty testitapaus odotetun paluuarvon.
     *
     * Funktio nostaa keskeytyksen mikäli arvot eivät täsmää.
     *
     * @param   string      name        Testin nimi
     * @param   function    func        Anonyymi funktio
     * @param   mixed       excepted    Odotettu paluuarvo (oletus TRUE)
     * @return  bool
     */
    this.test = function(name,func,expected) {
        // Tarkasta testiluokka
        if (!_sanityChk) {
            _sanityCheck();
            _sanityChk = true;
        }
        
        if (typeof expected == "undefined") {
            expected = true;
        }
        
        if (typeof func != "function") {
            throw "Func is not a function!";
        }
        
        var result = func.call(null);
        var compare = _compare(expected,result);
        
        // Arvot eivät täsmää
        if (!compare) {
            var error = "Error at "+name+": ";
            error += "Excepted value and returned value do not match!\r\n";
            error += "---------\r\n";
            error += "Excepted ("+typeof expected+"): "+JSON.stringify(expected)+"\r\n";
            error += "---------\r\n";
            error += "Returned ("+typeof result+"): "+JSON.stringify(result)+"\r\n";
            error += "---------";
            
            throw error;
        }
        
        return true;
    }
}