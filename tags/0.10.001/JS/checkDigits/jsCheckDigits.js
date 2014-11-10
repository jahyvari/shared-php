var SPModulo = new function() {
    var _this = this;
    
    /**
     * Laskee jakojäännöksen suuresta kokonaisluvusta.
     *
     * @param   string  val     Kokonaisluku
     * @param   int     modulo  Jakaja
     * @returns mixed
     */
    var _mod = function(val,modulo) {
        var result = false;
        var mod = parseInt(modulo);
        
        if (/^[0-9]{1,}$/.test(val) && mod == modulo && mod > 0) {
            val = val.toString();
            
            while (val.length > 10) {
                var part = val.slice(0,10);
                val = (parseInt(part)%mod)+val.slice(10);
            }
            
            result = parseInt(val)%mod;
        }
        
        return result;
    }
    
    /**
     * Korvaa Mod 97-10 tarkisteen aakkoset numeroarvoilla.
     *
     * @param   string  val Korvattava merkkijono
     * @returns string
     */
    var _replaceMod97_10Alphas = function(val) {
        var result = val;
        
        if (/^[A-Z0-9]{1,}$/.test(result)) {
            result = result.toString();
            
            var s = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";            
            for (var i = 10; i <= 35; i++) {
                var regexp = new RegExp(s.charAt(i-10),"g");
                result = result.replace(regexp,i.toString());
            }
        }
        
        return result;
    }
    
    /**
     * Tarkastaa arvon Luhn mod 10 tarkisteen.
     *
     * @param   string  val     Tarkastettava arvo
     * @returns bool
     */
    this.checkLuhnMod10 = function(val) {
        var result = false;
        
        if (/^[0-9]{2,}$/.test(val)) {
            val = val.toString();                      
            
            var multiplier = 2;
            var sum = 0;
            
            for (var i = (val.length-2); i >= 0; i--) {
                var tmp = parseInt(val.charAt(i))*multiplier--;
                if (tmp >= 10) {
                    tmp -= 9;
                }
                
                sum += tmp;
                
                if (multiplier == 0) {
                    multiplier = 2;
                }
            }
            
            if (sum > 0) {
                var check = 10-sum%10;
                
                if (val.slice(-1) == check.toString().slice(-1)) {
                    result = true;
                }
            }
        }
        
        return result;
    }
    
    /**
     * Tarkastaa arvon modulo 10 tarkisteen.
     *
     * @param   string  val     Tarkastettava arvo
     * @returns bool
     */
    this.checkModulo10 = function(val) {
        var result = false;
        
        if (/^[0-9]{2,}$/.test(val)) {
            val = val.toString();                      
            
            var multiplier = 3;
            var sum = 0;
            
            for (var i = (val.length-2); i >= 0; i--) {
                sum += parseInt(val.charAt(i))*multiplier;
                multiplier = ((multiplier == 3) ? 1 : 3);
            }
            
            if (sum > 0) {
                var check = 10-sum%10;
                
                if (val.slice(-1) == check.toString().slice(-1)) {
                    result = true;
                }
            }
        }
        
        return result;
    }
    
    /**
     * Tarkastaa arvon modulo 31 tarkisteen.
     *
     * @param   string  val     Tarkastettava arvo
     * @returns bool
     */
    this.checkModulo31 = function(val) {
        var result = false;
        
        if (/^[0-9]{1,}[0-9A-FHJ-NPR-Y]{1}$/.test(val)) {
            val = val.toString();
            
            var arr = ["0","1","2","3","4",
                "5","6","7","8","9",
                "A","B","C","D","E",
                "F","H","J","K","L",
                "M","N","P","R","S",
                "T","U","V","W","X",
                "Y"];
            
            if (val.replace(/^[0]{1,}/,"").length > 0) {
                var check = _mod(val.slice(0,-1),31);
                if (check !== false && arr.length > check) {
                    if (val.slice(-1) == arr[check]) {
                        result = true;
                    }
                }
            }
        }
        
        return result;
    }
    
    /**
     * Tarkastaa arvon modulo 97-10 tarkisteen.
     *
     * @param   string  val     Tarkastettava arvo
     * @returns bool
     */
    this.checkModulo97_10 = function(val) {
        var result = false;
        
        if (/^[A-Z0-9]{5,}$/.test(val)) {
            val = val.toString();
                        
            var substr = _replaceMod97_10Alphas(val.slice(4)+val.slice(0,4));
            if (_mod(substr,97) == 1) {
                result = true;
            }
        }
    
        return result;
    }
    
    /**
     * Luo arvon modulo 97-10 tarkisteen.
     *
     * @param   string  prefix  Etuliite (esim. RF)
     * @param   string  val     Arvo         
     * @returns mixed
     */
    this.createModulo97_10CheckDigit = function(prefix,val) {
        var result = false;
        
        if (/^[A-Z0-9]{1,}$/.test(val) && prefix.length == 2) {
            var substr = _replaceMod97_10Alphas(val+prefix+"00");
            var mod = 98-_mod(substr,97);
            if (mod < 10) {
                mod = "0"+mod;
            }
            
            result = mod.toString();
        }
        
        return result;
    }
}

var SPMultiplier137 = new function() {
    var _this = this;
    
    /**
     * Tarkastaa arvon kerroin 137 tarkisteen.
     *
     * @param   string  val     Tarkastettava arvo
     * @returns bool
     */
    this.checkMultiplier137 = function(val) {
        var result = false;
        
        if (/^[0-9]{4,}$/.test(val)) {
            val = val.toString();
            
            var check = _this.createMultiplier137CheckDigit(val.slice(0,val.length-1));
            if (check !== false && check == parseInt(val.slice(-1))) {
                result = true;
            }
        }
        
        return result;
    }
    
    /**
     * Luo arvon kerroin 137 tarkisteen.
     *
     * @param   string  val     Arvo
     * @returns mixed
     */
    this.createMultiplier137CheckDigit = function(val) {
        var result = false;
        
        if (/^[0-9]{3,}$/.test(val)) {
            val = val.toString();
            
            var multipliers = [7,3,1];
            var x = 0;
            var sum = 0;
            
            for (var i = (val.length-1); i >= 0; i--) {
                sum += parseInt(val.charAt(i))*multipliers[x++];
                if (x == 3) {
                    x = 0;
                }
            }
            
            if (sum > 0) {
                var check = 10-sum%10;
                result = parseInt(check.toString().slice(-1));
            }
        }
        
        return result;
    }
}

var SPCheckDigits = new function() {
    var _this = this;
    
    var _strRepeat = function(input,multiplier) {
        var result = "";
        
        for (var i = 0; i < multiplier; i++) {
            result += input.toString();
        }
        
        return result;
    }
    
    /**
     * Tarkastaa EAN-koodin (EAN-8, EAN-13 tai EAN-14).
     *
     * @param   string  ean     EAN-koodi
     * @returns bool
     */
    this.checkEANCode = function(ean) {
        var result = false;
        
        if (/^([0-9]{8}|[0-9]{13}|[0-9]{14})$/.test(ean)) {
            result = SPModulo.checkModulo10(ean);
        }
        
        return result;
    }
    
    /**
     * Tarkastaa suomalaisen konekielisen tai esitysmuotoisen (viivallisen)
     * BBAN tilinumeron.
     *
     * @param   string  bban    BBAN
     * @returns bool
     */
    this.checkFIBBAN = function(bban) {
        var result = false;
        
        if (/^[1-8]{1}[0-9]{5}(\-)?[0-9]{2,8}$/.test(bban)) {
            result = _this._checkFIBBAN(bban.replace("-",""));
        }
        
        return result;
    }
    
    /**
     * Tarkastaa suomalaisen konekielisen BBAN tilinumeron.
     *
     * @param   string  bban    BBAN
     * @returns bool
     */
    this._checkFIBBAN = function(bban) {
        var result = false;
        
        if (/^[1-8]{1}[0-9]{7,13}$/.test(bban)) {
            bban = bban.toString();
            
            var part1 = bban.slice(0,6);
            var part2 = bban.slice(6);
            var count = 8-part2.length;
            
            switch (bban.slice(0,1)) {
                case "4":
                case "5":
                    part2 = part2.slice(0,1)+
                        _strRepeat("0",count)+
                        part2.slice(1);
                    break;                    
                default:
                    part2 = _strRepeat("0",count)+part2;
            }
            
            result = SPModulo.checkLuhnMod10(part1+part2);
        }
        
        return result;
    }
    
    /**
     * Tarkastaa suomalaisen Y-tunnuksen.
     *
     * @param   string  businessid  Y-tunnus
     * @returns bool
     */
    this.checkFIBusinessId = function(businessid) {
        var result = false;
        
        if (/^[0-9]{7}[\-]{1}[0-9]{1}$/.test(businessid)) {
            businessid = businessid.toString();
            
            var multipliers = [7,9,10,5,8,4,2];
            var sum = 0;
            
            for (var i = 0; i < 7; i++) {
                sum += parseInt(businessid.charAt(i))*multipliers[i];
            }
            
            if (sum > 0) {
                var check = sum%11;
                
                if (check == 0 || (check >= 2 && check <= 10)) {
                    if (check >= 2) {
                        check = 11-check;
                    }
                    
                    if (parseInt(businessid.slice(-1)) == check) {
                        result = true;
                    }
                }
            }
        }
        
        return result;
    }
    
    /**
     * Tarkastaa suomalaisen viitenumeron.
     *
     * @param   string  reference   Viitenumero
     * @returns bool
     */
    this.checkFIReference = function(reference) {
        var result = false;
        
        if (/^[0-9]{4,20}$/.test(reference)) {
            result = SPMultiplier137.checkMultiplier137(reference);
        }
        
        return result;
    }
    
    /**
     * Tarkastaa IBAN tilinumeron.
     *
     * @param   string  iban    IBAN
     * @returns bool
     */
    this.checkIBAN = function(iban) {
        var result = false;
        
        if (/^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/.test(iban)) {
            result = SPModulo.checkModulo97_10(iban);    
        }
        
        return result;
    }
    
    /**
     * Tarkastaa suomalaisen henkilötunnuksen.
     *
     * @param   string  personid    Henkilötunnus
     * @returns bool
     */
    this.checkFIPersonId = function(personid) {
        var result = false;
        
        if (/^[0-9]{6}[\+\-A]{1}[0-9]{3}[0-9A-FHJ-NPR-Y]{1}$/.test(personid)) {
            personid = personid.toString();
            
            var day = parseInt(personid.slice(0,2));
            var month = parseInt(personid.slice(2,4))-1;
            var year = personid.slice(4,6);
            
            year = personid.slice(6,7).
                replace("A","18").
                replace("-","19").
                replace("+","20")+
                year;
            
            var d = new Date(year,month,day);
            if (d.getFullYear() == year && d.getMonth() == month && d.getDate() == day) {
                result = SPModulo.checkModulo31(personid.slice(0,6)+personid.slice(7));
            }
        }
        
        return result;    
    }
    
    /**
     * Tarkastaa RF viitteen.
     *
     * @param   string  reference   Viite
     * @returns bool
     */
    this.checkRFReference = function(reference) {
        var result = false;
        
        if (/^RF[0-9]{2}[A-Z0-9]{1,21}$/.test(reference)) {
            result = SPModulo.checkModulo97_10(reference);    
        }
        
        return result;
    }
    
    /**
     * Luo suomalaisen viitenumeron numeroarvosta.
     *
     * @param   string  val     Numeroarvo
     * @returns mixed
     */
    this.createFIReference = function(val) {
        var result = false;
        
        if (/^[0-9]{3,19}$/.test(val)) {
            var check = SPMultiplier137.createMultiplier137CheckDigit(val);
            if (check !== false) {
                result = val.toString()+check;
            }
        }
        
        return result;
    }
    
    /**
     * Luo RF viitteen merkkijonosta.
     *
     * @param   string  val     Merkkijono
     * @returns mixed
     */
    this.createRFReference = function(val) {
        var result = false;
        
        if (/^[A-Z0-9]{1,21}$/.test(val)) {
            var prefix = "RF";
            var check = SPModulo.createModulo97_10CheckDigit(prefix,val);
            if (check !== false) {
                result = prefix+check+val;
            }
        }
        
        return result;
    }
    
    /**
     * Hakee suomalaiseen IBAN tilinumeroon liittyvän BIC:n.
     *
     * @param   string  iban   IBAN
     * @returns mixed
     */
    this.getFIBIC = function(iban) {
        var result = false;
        
        if (iban.slice(0,2) == "FI" && _this.checkIBAN(iban)) {
            var bban = iban.slice(4);
            if (_this._checkFIBBAN(bban)) {
                var bic = {
                    "479"   : "POPFFI22",  // Bonum Pankki
                    "713"   : "CITIFIHX",  // Citibank
                    "8"     : "DABAFIHH",  // Danske Bank
                    "34"    : "DABAFIHX",  // Danske Bank
                    "37"    : "DNBAFIHX",  // DNB Bank ASA, Finland Branch
                    "31"    : "HANDFIHH",  // Handelsbanken
                    "1"     : "NDEAFIHH",  // Nordea Pankki (Nordea)
                    "2"     : "NDEAFIHH",  // Nordea Pankki (Nordea)
                    "5"     : "OKOYFIHH",  // Pohjola Pankki (OP-Pohjola-ryhmän pankkien keskusrahalaitos)
                    "33"    : "ESSEFIHX",  // Skandinaviska Enskilda Banken (SEB)
                    "39"    : "SBANFIHH",  // S-Pankki
                    "38"    : "SWEDFIHH",  // Swedbank
                    "4"     : "HELSFIHH",  // Aktia Pankki, Säästöpankit (Sp) ja POP Pankit (POP)
                    "36"    : "TAPIFI22",  // Tapiola Pankki
                    "715"   : "ITELFIHH",  // Säästöpankkien Keskuspankki
                    "6"     : "AABAFI22"   // Ålandsbanken (ÅAB)
                };
                
                switch (bban.slice(0,1)) {
                    case "3":
                        var len = 2;
                        break;                        
                    case "4":
                    case "7":
                        var len = 3;
                        break;                        
                    default:
                        var len = 1;
                }
                
                var prefix = bban.slice(0,len);
                if (bic.hasOwnProperty(prefix)) {
                    result = bic[prefix];
                }
            }
        }
        
        return result;
    }
}

// Node.js export
if (typeof module == "object" && module.hasOwnProperty("exports")) {
    module.exports.SPModulo = SPModulo;
    module.exports.SPMultiplier137 = SPMultiplier137;
    module.exports.SPCheckDigits = SPCheckDigits;
}