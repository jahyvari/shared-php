var SPModulo = new function() {
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
}