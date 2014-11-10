var SPFormHelper = new function() {
    var _this = this;
    
    // True = funktiot kaiuttavat elementit suoraan ruudulle (document.write)
    this.autoecho   = false;
    
    // True = attribuuttien arvojen HTML:n erikoismerkit korvataan automaattisesti
    this.autoescape = true;
    
    /**
     * Muuttaa attribuuttiobjektin merkkijonoksi.
     *
     * @param   object  attr    Attribuutit
     * @returns string
     */
    var _attrToStr = function(attr) {
        var html = "";
        
        for (var key in attr) {
            var value = attr[key];
            if (value === null) {
                continue;
            }
            
            html += ((html.length > 0) ? " " : "")+
                key+
                "=\""+
                _htmlescape(value)+
                "\"";
        }
        
        return html;
    }
    
    /**
     * Korva merkkijonosta HTML:n erikoismerkit jos autoescape = true.
     *
     * @param   string  value   Merkkijono
     * @returns string
     */
    var _htmlescape = function(value) {
        var type = typeof value;
        if (type != "string" && type != "number") {
            value = "";
        }
        
        var result = value.toString();
        
        if (_this.autoescape) {
            var map = {
                "&":    '&amp;',
                "<":    '&lt;',
                ">":    '&gt;',
                "\"":   '&#34;',
                "'":    '&#39;'
            };
            
            result = result.replace(/[&<>'"]/g,function(c){
                return map[c];
            });
        }
                
        return result;
    }
    
    /**
     * Luo button elementin.
     *
     * @param   string  text    Painikkeen teksti
     * @param   object  attr    Muut attribuutit (esim. class tai id)
     * @param   string  type    Type attribuutti (oletus = button)
     * @returns string
     */
    this.button = function(text,attr,type) {
        if (typeof attr != "object") {
            attr = {};
        }
        
        if (typeof type != "string") {
            type = "button";
        }
        
        attr["type"] = type;
        
        var attrStr = _attrToStr(attr);
        
        var html = "<button "+attrStr+">"+
            _htmlescape(text)+
            "</button>";
            
        if (_this.autoecho) {
            document.write(html);
        }
        
        return html;
    }
    
    /**
     * Luo input/checkbox elementin.
     *
     * @param   string  name        Name attribuutti
     * @param   string  value       Value attribuutti
     * @param   object  attr        Muut attribuutit (esim. class tai id)
     * @param   string  selected    Jos value == selected niin checked = true
     * @returns string
     */
    this.checkbox = function(name,value,attr,selected) {
        if (typeof attr != "object") {
            attr = {};
        }
        
        if (typeof selected != "undefined" && selected == value) {
            attr["checked"] = "checked";
        }
        
        return _this.input(name,value,attr,"checkbox");
    }
    
    /**
     * Luo input/email elementin.
     *
     * @param   string  name    Name attribuutti
     * @param   string  value   Value attribuutti
     * @param   object  attr    Muut attribuutit (esim. class tai id)
     * @returns string
     */
    this.email = function(name,value,attr) {
        return _this.input(name,value,attr,"email");
    }
    
    /**
     * Luo input/hidden elementin.
     *
     * @param   string  name    Name attribuutti
     * @param   string  value   Value attribuutti
     * @param   object  attr    Muut attribuutit (esim. class tai id)
     * @returns string
     */
    this.hidden = function(name,value,attr) {
        return _this.input(name,value,attr,"hidden");
    }
    
    /**
     * Luo input elementin.
     *
     * @param   string  name    Name attribuutti
     * @param   string  value   Value attribuutti
     * @param   object  attr    Muut attribuutit (esim. class tai id)
     * @param   string  type    Type attribuutti (oletus = text)
     * @returns string
     */
    this.input = function(name,value,attr,type) {
        if (typeof attr != "object") {
            attr = {};
        }
        
        if (typeof type != "string") {
            type = "text";
        }
        
        attr["name"]    = name;
        attr["value"]   = value;
        attr["type"]    = type;
        
        var attrStr = _attrToStr(attr);
        
        var html = "<input "+
            attrStr+
            " />";
        
        if (_this.autoecho) {
            document.write(html);
        }
        
        return html; 
    }
    
    /**
     * Luo select/multiselect elementin.
     *
     * @param   string  name        Name attribuutti
     * @param   object  values      Option elementit (key/value parit)
     * @param   object  attr        Muut attribuutit (esim. class tai id)
     * @param   object  optionAttr  Muut attribuutit option elementteihin
     * @param   mixed   selected    Valitut option elementit, voi olla taulukko tai yksittäinen arvo
     * @returns string
     */
    this.multiselect = function(name,values,attr,optionAttr,selected) {
        if (typeof attr != "object") {
            attr = {};
        }
        
        attr["multiple"] = "multiple";
        
        return _this.select(name,values,attr,optionAttr,selected);
    }
    
    /**
     * Luo input/number elementin.
     *
     * @param   string  name    Name attribuutti
     * @param   string  value   Value attribuutti
     * @param   object  attr    Muut attribuutit (esim. class tai id)
     * @returns string
     */
    this.number = function(name,value,attr) {
        return _this.input(name,value,attr,"number");
    }
    
    /**
     * Luo option elementit valintalistaa varten.
     *
     * @param   object  values      Option elementtien key/value parit
     * @param   object  attr        Muut attribuutit
     * @param   mixed   selected    Valitut elementit, voi olla taulukko tai yksittäinen arvo
     * @returns string
     */
    this.options = function(values,attr,selected) {
        if (typeof attr != "object") {
            attr = {};
        }
        
        var isArray = function(value) {
            var result = false;
            if (typeof value == "object" && value instanceof Array) {
                result = true;
            }
            return result;
        }
        
        var html = "";
        
        if (typeof values == "object") {
            for (var key in values) {
                var value = values[key];
                
                if (typeof value == "object") {
                    html += "<optgroup label=\""+_htmlescape(key)+"\">"+
                        _this.options(value,attr,selected)+
                        "</optgroup>";
                } else {
                    var tempAttr = {};
                    for (var _key in attr) {
                        tempAttr[_key] = attr[_key];
                    }
                    
                    if (typeof selected != "undefined") {
                        if (isArray(selected)) {
                            if (parseInt(key) == key && selected.indexOf(parseInt(key)) != -1) {
                                tempAttr["selected"] = "selected";
                            } else if (selected.indexOf(key) != -1) {
                                tempAttr["selected"] = "selected";
                            }
                        } else if (!isArray(selected) && selected == key) {
                            tempAttr["selected"] = "selected";
                        }
                    }                                        
                    
                    tempAttr["value"] = key;
                    
                    var attrStr = _attrToStr(tempAttr);
                    
                    html += "<option "+attrStr+">"+
                        _htmlescape(value)+
                        "</option>";
                }
            }
        }
        
        if (_this.autoecho) {
            document.write(html);
        }
        
        return html;
    }
    
    /**
     * Luo input/password elementin.
     *
     * @param   string  name    Name attribuutti
     * @param   string  value   Value attribuutti
     * @param   object  attr    Muut attribuutit (esim. class tai id)
     * @returns string
     */
    this.password = function(name,value,attr) {
        return _this.input(name,value,attr,"password");
    }
    
    /**
     * Luo input/radio elementin.
     *
     * @param   string  name        Name attribuutti
     * @param   string  value       Value attribuutti
     * @param   object  attr        Muut attribuutit (esim. class tai id)
     * @param   string  selected    Jos value == selected niin checked = true
     * @returns string
     */
    this.radio = function(name,value,attr,selected) {
        if (typeof attr != "object") {
            attr = {};
        }
                
        if (typeof selected != "undefined" && selected == value) {
            attr["checked"] = "checked";
        }
        
        return _this.input(name,value,attr,"radio");
    }
    
    /**
     * Luo button/reset elementin.
     *
     * @param   string  text    Painikkeen teksti
     * @param   object  attr    Muut attribuutit (esim. class tai id)
     * @returns string
     */
    this.reset = function(text,attr) {
        return _this.button(text,attr,"reset");
    }
    
    /**
     * Luo select elementin.
     *
     * @param   string  name        Name attribuutti
     * @param   object  values      Option elementit (key/value parit)
     * @param   object  attr        Muut attribuutit (esim. class tai id)
     * @param   object  optionAttr  Muut attribuutit option elementteihin
     * @param   mixed   selected    Valitut option elementit, voi olla taulukko tai yksittäinen arvo
     * @returns string
     */
    this.select = function(name,values,attr,optionAttr,selected) {
        if (typeof attr != "object") {
            attr = {};
        }
        
        var autoecho = _this.autoecho;
        _this.autoecho = false;
        
        attr["name"] = name;
        
        var attrStr = _attrToStr(attr);
        
        var html = "<select "+attrStr+">"+
            _this.options(values,optionAttr,selected)+
            "</select>";
        
        _this.autoecho = autoecho;
        
        if (_this.autoecho) {
            document.write(html);
        }
        
        return html;
    }
    
    /**
     * Luo button/submit elementin.
     *
     * @param   string  text    Painikkeen teksti
     * @param   object  attr    Muut attribuutit (esim. class tai id)
     * @returns string
     */
    this.submit = function(text,attr) {
        return _this.button(text,attr,"submit");
    }
    
    /**
     * Luo textarea elementin.
     *
     * @param   string  name        Name attribuutti
     * @param   string  text        Elementin sisältö/teksti
     * @param   object  attr        Muut attribuutit (esim. class tai id)
     * @returns string
     */
    this.textarea = function(name,text,attr) {
        if (typeof attr != "object") {
            attr = {};
        }
        
        attr["name"] = name;
        
        var attrStr = _attrToStr(attr);
        
        var html = "<textarea "+attrStr+">"+
            _htmlescape(text)+
            "</textarea>";
            
        if (_this.autoecho) {
            document.write(html);
        }
        
        return html;
    }
}