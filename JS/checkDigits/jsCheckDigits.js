/**
 * Tarkastaa merkkijonon säännöllistä lauseketta vastaan.
 *
 * @param   string  val     Merkkijono
 * @param   string  pattern Säännöllinen lauseke
 * @returns bool
 */
function _matchPattern(val,pattern) {
    var result = false;
    var re = new RegExp(pattern);
    
    if (typeof val == "string" && re.test(val)) {
        result = true;
    }
    
    return result;
}

var Modulo = new function() {
    /**
     * Tarkastaa arvon modulo 10 tarkisteen.
     *
     * @param   string  val     Tarkastettava arvo
     * @returns bool
     */
    this.checkModulo10 = function(val) {
        var result = false;
        
        if (_matchPattern(val,/^[0-9]{2,}$/)) {
            var multiplier = 3;
            var strlen = val.length;
            var sum = 0;
            
            for (i = (strlen-2); i >= 0; i--) {
                sum += parseInt(val.charAt(i))*multiplier;
                multiplier = ((multiplier == 3) ? 1 : 3);
            }
            
            if (sum > 0) {
                var check = 10-sum%10;
                
                if (val.charAt(strlen-1) == check.toString().slice(-1)) {
                    result = true;
                }
            }
        }
        
        return result;
    }
}

var CheckDigits = new function() {
    /**
     * Tarkastaa EAN-koodin (EAN-8, EAN-13 tai EAN-14).
     *
     * @param   string  ean     EAN-koodi
     * @returns bool
     */
    this.checkEANCode = function(ean) {
        var result = false;
        
        if (_matchPattern(ean,/^([0-9]{8}|[0-9]{13}|[0-9]{14})$/)) {
            result = Modulo.checkModulo10(ean);
        }
        
        return result;
    }
}