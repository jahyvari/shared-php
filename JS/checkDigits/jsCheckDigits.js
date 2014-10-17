var SPModulo = new function() {
    var _this = this;
    
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
}

// Node.js export
if (module != "undefined" && module.hasOwnProperty("exports")) {
    module.exports.SPModulo = SPModulo;
    module.exports.SPMultiplier137 = SPMultiplier137;
    module.exports.SPCheckDigits = SPCheckDigits;
}