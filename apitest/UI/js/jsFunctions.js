// Polku rajapintaan -> viedään gatewayn kautta
var __API_URL = "http://"+
    window.location.host+
    window.location.pathname+
    "gateway/request";

function _API(className) {        
    var _ajaxOpts       = {
        async:          true,
        cache:          false,
        contentType:    "application/json",
        dataType:       "json",
        type:           "POST"
    };
    var _className      = className;
    var _errorFunc      = null;
    var _successFunc    = null;
    var _this           = this;
            
    /**
     * Funktio lähettää AJAX kutsun sovelluksen rajapintaan
     *
     * @param   string      functionName    Kutsuttava funktio
     * @param   object      data            Lähetettävä data (vapaaehtoinen)
     * @returns object
     */
    this.call = function(functionName,data) {
        if (typeof data == "undefined" || data == null) {        
            data = {};
        }
        
        var result = {};
        
        // Luodaan URL
        var url = __API_URL+
            "/"+
            _className+
            "/"+
            functionName;
        
        // Otetaan kopiot funktiosta jotteivat ne muutu AJAX kutsun aikana   
        var __errorFunc     = _errorFunc;
        var __successFunc   = _successFunc;
        
        // Asetataan AJAX optiot    
        var ajaxOpts    = $.extend({},_ajaxOpts);        
        ajaxOpts.url    = url;
        ajaxOpts.error  = function(xhr,status,error) {
            // Suorita epäonnistuneen kutsun käsittelyfunktio
            if (typeof __errorFunc == "function") {
                __errorFunc.call({functionName: functionName},xhr,status,error);    
            } else {
                alert("Kutsu epäonnistui!");
            }
        };
        ajaxOpts.success = function(result,status,xhr) {            
            // Suorita hyväksytyn kutsun käsittelyfunktio
            if (typeof __successFunc == "function") {                
                __successFunc.call({functionName: functionName},result,status,xhr);    
            }
        };        
                
        switch (ajaxOpts.contentType) {
            // Muutetaan data JSON:ksi tarvittaessa
            case "application/json":
                ajaxOpts.data = JSON.stringify(data);
                break;
            default:
                ajaxOpts.data = data;
        }
        
        var response = $.ajax(ajaxOpts);        
        if (response.hasOwnProperty("responseJSON")) {
            result = response.responseJSON;
        }
        
        return result;
    }
    
    /**
     * Funktiolla voi asettaa AJAX option.
     *
     * @param   name    string  Option nimi
     * @param   value   mixed   Option arvo
     * @returns bool
     */
    this.setAjaxOpt = function(name,value) {
        if (_ajaxOpts.hasOwnProperty(name)) {
            _ajaxOpts[name] = value;
            return true;
        } else {
            return false;
        }
    }
    
    /*
     * Funktiolla voi asettaa epäonnistuneen AJAX kutsun käsittelijän.
     *
     * @param   function    func    Funktio
     * @returns bool
     */
    this.setErrorFunc = function(func) {
        if (typeof func == "function" || func == null) {
            _errorFunc = func;
            return true;
        } else {
            return false;
        }
    }
            
    /*
     * Funktiolla voi asettaa onnistuneen AJAX kutsun käsittelijän.
     *
     * @param   function    func    Funktio
     * @returns bool
     */
    this.setSuccessFunc = function(func) {
        if (typeof func == "function" || func == null) {
            _successFunc = func;
            return true;
        } else {
            return false;
        }
    }
}

/**
 * Palauttaa listan luokista ja funktioista joita API tarjoaa.
 *
 * @returns object
 */
function setAPIFunctions() {
    var list = {};

    var publicClass = new _API("PublicClass");        
    publicClass.setAjaxOpt("async",false);
    
    var result = publicClass.call("getFunctionList");    
    if (result.code == 0) {
        $.each(result.data,function(className,functions) {
            list[className] = {};
            
            $.each(functions,function(index,functionName) {
                list[className][functionName] = function(data) {
                    var api = new _API(className);
                    api.setAjaxOpt("async",false);
                    return api.call(functionName,data);
                }
            });
        });
    }
    
    return list;
}

var API = setAPIFunctions();