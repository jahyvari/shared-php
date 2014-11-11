var SPUnitConverter = new function() {
    var _this = this;
    
    this.CM_TO_INCH      = 0.393700787;
    this.FOOT_TO_YARD    = 3;
    this.FOOT_TO_MILE    = 5280;
    this.INCH_TO_FOOT    = 12;
    this.KG_TO_LB        = 2.20462262;
    this.KM_TO_MILE      = 0.621371192;
    this.PICA_TO_INCH    = 6;
    this.POINT_TO_PICA   = 12;
    this.YARD_TO_MILE    = 1760;
    
    /**
     * Muuttaa senttimetrit jaloiksi.
     * 
     * @param   double  cm      Pituus senttimetreinä
     * @returns mixed
     */                
    this.cmToFoot = function(cm) {
       var result = false;
       
       var parsed = parseFloat(cm);
       if (parsed == cm) {
           result = _this.inchToFoot(_this.cmToInch(parsed));
       }
       
       return result;
    }
    
    /**
     * Muuttaa senttimetrit tuumiksi.
     * 
     * @param   double  cm      Pituus senttimetreinä
     * @returns mixed
     */
    this.cmToInch = function(cm) {
       var result = false;
       
       var parsed = parseFloat(cm);
       if (parsed == cm) {
           result = parsed*_this.CM_TO_INCH;
       }
       
       return result;
    }
    
    /**
     * Muuttaa jalat senttimetreiksi.
     * 
     * @param   double  foot    Pituus jalkoina 
     * @returns mixed
     */
    this.footToCm = function(foot) {
       var result = false;
       
       var parsed = parseFloat(foot);
       if (parsed == foot) {
           result = _this.inchToCm(_this.footToInch(parsed));
       }
       
       return result;
    }
    
    /**
     * Muuttaa jalat tuumiksi.
     * 
     * @param   double  foot    Pituus jalkoina 
     * @returns mixed
     */
    this.footToInch = function(foot) {
       var result = false;
       
       var parsed = parseFloat(foot);
       if (parsed == foot) {
           result = parsed*_this.INCH_TO_FOOT;
       }
       
       return result;
    }
    
    /**
     * Muuttaa tuumat centtimetreiksi.
     * 
     * @param   double  inch    Pituus tuumina 
     * @returns mixed
     */
    this.inchToCm = function(inch) {
       var result = false;
       
       var parsed = parseFloat(inch);
       if (parsed == inch) {
           result = parsed/_this.CM_TO_INCH;
       }
       
       return result;
    }
    
    /**
     * Muuttaa tuumat jaloiksi.
     * 
     * @param   double  inch    Pituus tuumina 
     * @returns mixed
     */
    this.inchToFoot = function(inch) {
       var result = false;
       
       var parsed = parseFloat(inch);
       if (parsed == inch) {
           result = parsed/_this.INCH_TO_FOOT;
       }
       
       return result;
    }
    
    /**
     * Muuttaa kilogrammat paunoiksi.
     *
     * @param   double  kg      Paino kilogrammoina
     * @returns mixed
     */
    this.kgToLb = function(kg) {
       var result = false;
       
       var parsed = parseFloat(kg);
       if (parsed == kg) {
           result = parsed*_this.KG_TO_LB;
       }
       
       return result;
    }
    
    /**
     * Muuttaa kilometrit maileiksi.
     *
     * @param   double  km      Pituus kilometreinä
     * @returns mixed
     */
    this.kmToMile = function(km) {
       var result = false;
       
       var parsed = parseFloat(km);
       if (parsed == km) {
           result = parsed*_this.KM_TO_MILE;
       }
       
       return result;
    }
    
    /**
     * Muuttaa paunat kilogrammoiksi
     *
     * @param   double  lb      Paino paunoina
     * @returns mixed
     */
    this.lbToKg = function(lb) {
       var result = false;
       
       var parsed = parseFloat(lb);
       if (parsed == lb) {
           result = parsed/_this.KG_TO_LB;
       }
       
       return result;
    }
    
    /**
     * Muuttaa mailit kilometreiksi
     *
     * @param   double  mile    Pituus maileina
     * @returns mixed
     */
    this.mileToKm = function(mile) {
       var result = false;
       
       var parsed = parseFloat(mile);
       if (parsed == mile) {
           result = parsed/_this.KM_TO_MILE;
       }
       
       return result;
    }
}

// Node.js export
if (typeof module == "object" && module.hasOwnProperty("exports")) {
    module.exports.SPUnitConverter = SPUnitConverter;
}