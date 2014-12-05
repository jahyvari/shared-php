<?php
    namespace SharedPHP;
    
    class FormTools {
        # True = funktiot kaiuttavat elementit suoraan ruudulle
        public static $autoecho     = true;
        
        # True = attribuuttien arvot ajetaan htmlspecialchars funktion läpi automaattisesti
        public static $autoescape   = true;
        
        # Merkistö htmlspecialchars funktiota varten
        public static $charset      = "UTF-8";
         
        /**
         * Muuttaa attribuuttitaulukon merkkijonoksi.
         *
         * @param   array   $attr   Attribuutit
         * @return  string
         */
        private static function _attrToStr($attr) {
            $html = "";
            
            if (is_array($attr)) {
                foreach ($attr as $key => $value) {
                    if (!isset($value)) {
                        continue;
                    }
                    
                    $html .= (($html) ? " " : "").$key.
                        "=\"".
                        self::_htmlescape($value).
                        "\"";
                }
            }
            
            return $html;
        }
        
        /**
         * Ajaa merkkijonon htmlspecialchars funktion läpi jos autoescape = true.
         *
         * @param   string  $value  Merkkijono
         * @return  string
         */
        public static function _htmlescape($value) {
            if (!is_string($value) && !is_numeric($value)) {
                $value = "";
            }
            
            if (self::$autoescape) {
                return htmlspecialchars($value,(ENT_COMPAT | ENT_HTML401),self::$charset,true);
            } else {
                return $value;
            }
        }
        
        /**
         * Luo button elementin.
         *
         * @param   string  $text   Painikkeen teksti
         * @param   array   $attr   Muut attribuutit (esim. class tai id)
         * @param   string  $type   Type attribuutti (oletus = button)
         * @return  string
         */
        public static function button($text,$attr = array(),$type = "button") {
            $attr = ((is_array($attr)) ? $attr : array());
            
            $attr["type"] = $type;
            
            $attrStr = self::_attrToStr($attr);
            
            $html = "<button $attrStr>".
                self::_htmlescape($text).
                "</button>";
                        
            if (self::$autoecho) {
                echo $html;
            }
            
            return $html;
        }
        
        /**
         * Luo input/checkbox elementin.
         *
         * @param   string  $name       Name attribuutti
         * @param   string  $value      Value attribuutti
         * @param   array   $attr       Muut attribuutit (esim. class tai id)
         * @param   string  $selected   Jos $value == $selected niin checked = true
         * @return  string
         */
        public static function checkbox($name,$value,$attr = array(),$selected = null) {
            $attr = ((is_array($attr)) ? $attr : array());
            
            if (isset($selected) && $selected == $value) {
                $attr["checked"] = "checked";             
            }
            
            return self::input($name,$value,$attr,"checkbox");
        }
        
        /**
         * Luo input/email elementin.
         *
         * @param   string  $name   Name attribuutti
         * @param   string  $value  Value attribuutti
         * @param   array   $attr   Muut attribuutit (esim. class tai id)
         * @return  string
         */
        public static function email($name,$value,$attr = array()) {
            return self::input($name,$value,$attr,"email");
        }
        
        /**
         * Luo input/file elementin.
         *
         * @param   string  $name   Name attribuutti
         * @param   string  $value  Value attribuutti
         * @param   array   $attr   Muut attribuutit (esim. class tai id)
         * @return  string
         */
        public static function file($name,$value,$attr = array()) {
            return self::input($name,$value,$attr,"file");
        }
        
        /**
         * Luo input/hidden elementin.
         *
         * @param   string  $name   Name attribuutti
         * @param   string  $value  Value attribuutti
         * @param   array   $attr   Muut attribuutit (esim. class tai id)
         * @return  string
         */
        public static function hidden($name,$value,$attr = array()) {
            return self::input($name,$value,$attr,"hidden");
        }
        
        /**
         * Luo input/image elementin.
         *
         * @param   string  $name   Name attribuutti
         * @param   string  $value  Value attribuutti
         * @param   array   $attr   Muut attribuutit (esim. class tai id)
         * @return  string
         */
        public static function image($name,$value,$attr = array()) {
            return self::input($name,$value,$attr,"image");
        }
        
        /**
         * Luo input elementin.
         *
         * @param   string  $name   Name attribuutti
         * @param   string  $value  Value attribuutti
         * @param   array   $attr   Muut attribuutit (esim. class tai id)
         * @param   string  $type   Type attribuutti (oletus = text)
         * @return  string
         */
        public static function input($name,$value,$attr = array(),$type = "text") {
            $attr = ((is_array($attr)) ? $attr : array());
            
            $attr["name"]   = $name;
            $attr["value"]  = $value;
            $attr["type"]   = $type;
                        
            $attrStr = self::_attrToStr($attr);
            
            $html = "<input $attrStr />";
                        
            if (self::$autoecho) {
                echo $html;
            }
            
            return $html;                        
        }
        
        /**
         * Luo select/multiselect elementin.
         *
         * @param   string  $name       Name attribuutti
         * @param   array   $values     Option elementit (key/value parit)
         * @param   array   $attr       Muut attribuutit (esim. class tai id)
         * @param   array   $optionAttr Muut attribuutit option elementteihin
         * @param   mixed   $selected   Valitut option elementit, voi olla taulukko tai yksittäinen arvo
         * @return  string
         */
        public static function multiselect($name,$values,$attr = array(),$optionAttr = array(),$selected = null) {
            $attr = ((is_array($attr)) ? $attr : array());
            
            $attr["multiple"] = "multiple";
            
            return self::select($name,$values,$attr,$optionAttr,$selected);
        }
        
        /**
         * Luo input/number elementin.
         *
         * @param   string  $name   Name attribuutti
         * @param   string  $value  Value attribuutti
         * @param   array   $attr   Muut attribuutit (esim. class tai id)
         * @return  string
         */
        public static function number($name,$value,$attr = array()) {
            return self::input($name,$value,$attr,"number");
        }
        
        /**
         * Luo option elementit valintalistaa varten.
         *
         * @param   array   $values     Option elementtien key/value parit
         * @param   array   $attr       Muut attribuutit
         * @param   mixed   $selected   Valitut elementit, voi olla taulukko tai yksittäinen arvo
         * @return  string
         */
        public static function options($values,$attr = array(),$selected = null) {
            $attr = ((is_array($attr)) ? $attr : array());
            
            $html = "";
            
            if (is_array($values)) {
                foreach ($values as $key => $value) {
                    if (is_array($value)) {
                        $html .= "<optgroup label=\"".self::_htmlescape($key)."\">".
                            self::options($value,$attr,$selected).
                            "</optgroup>";                                                
                    } else {                                                
                        $tempAttr = $attr;
                        
                        if (isset($selected)) {
                            if ((is_array($selected) && in_array($key,$selected)) ||
                                    (!is_array($selected) && $selected == $key)) {
                                $tempAttr["selected"] = "selected";
                            }
                        }
                        
                        $tempAttr["value"] = $key;
                        
                        $attrStr = self::_attrToStr($tempAttr);
                                                
                        $html .= "<option $attrStr>".
                            self::_htmlescape($value).
                            "</option>";
                    }
                }
            }
            
            if (self::$autoecho) {
                echo $html;
            }
            
            return $html;
        }
        
        /**
         * Luo input/password elementin.
         *
         * @param   string  $name   Name attribuutti
         * @param   string  $value  Value attribuutti
         * @param   array   $attr   Muut attribuutit (esim. class tai id)
         * @return  string
         */
        public static function password($name,$value,$attr = array()) {
            return self::input($name,$value,$attr,"password");
        }
        
        /**
         * Luo input/radio elementin.
         *
         * @param   string  $name       Name attribuutti
         * @param   string  $value      Value attribuutti
         * @param   array   $attr       Muut attribuutit (esim. class tai id)
         * @param   string  $selected   Jos $value == $selected niin checked = true
         * @return  string
         */
        public static function radio($name,$value,$attr = array(),$selected = null) {
            $attr = ((is_array($attr)) ? $attr : array());
            
            if (isset($selected) && $selected == $value) {
                $attr["checked"] = "checked";                
            }
            
            return self::input($name,$value,$attr,"radio");
        }
        
        /**
         * Luo input/range elementin.
         *
         * @param   string  $name   Name attribuutti
         * @param   string  $value  Value attribuutti
         * @param   array   $attr   Muut attribuutit (esim. class tai id)
         * @return  string
         */
        public static function range($name,$value,$attr = array()) {
            return self::input($name,$value,$attr,"range");
        }
        
        /**
         * Luo button/reset elementin.
         *
         * @param   string  $text   Painikkeen teksti
         * @param   array   $attr   Muut attribuutit (esim. class tai id)
         * @return  string
         */
        public static function reset($text,$attr = array()) {
            return self::button($text,$attr,"reset");
        }
        
        /**
         * Luo select elementin.
         *
         * @param   string  $name       Name attribuutti
         * @param   array   $values     Option elementit (key/value parit)
         * @param   array   $attr       Muut attribuutit (esim. class tai id)
         * @param   array   $optionAttr Muut attribuutit option elementteihin
         * @param   mixed   $selected   Valitut option elementit, voi olla taulukko tai yksittäinen arvo
         * @return  string
         */
        public static function select($name,$values,$attr = array(),$optionAttr = array(),$selected = null) {
            $autoecho = self::$autoecho;
            self::$autoecho = false;
            
            $attr = ((is_array($attr)) ? $attr : array());
            
            $attr["name"] = $name;
            
            $attrStr = self::_attrToStr($attr);
            
            $html = "<select $attrStr>".
                self::options($values,$optionAttr,$selected).
                "</select>";

            self::$autoecho = $autoecho;
            
            if (self::$autoecho) {
                echo $html;
            }
            
            return $html;
        }
        
        /**
         * Luo button/submit elementin.
         *
         * @param   string  $text   Painikkeen teksti
         * @param   array   $attr   Muut attribuutit (esim. class tai id)
         * @return  string
         */
        public static function submit($text,$attr = array()) {
            return self::button($text,$attr,"submit");
        }
        
        /**
         * Luo textarea elementin.
         *
         * @param   string  $name       Name attribuutti
         * @param   string  $text       Elementin sisältö/teksti
         * @param   array   $attr       Muut attribuutit (esim. class tai id)
         * @return  string
         */
        public static function textarea($name,$text,$attr = array()) {
            $attr = ((is_array($attr)) ? $attr : array());
            
            $attr["name"] = $name;
            
            $attrStr = self::_attrToStr($attr);
            
            $html = "<textarea $attrStr>".
                self::_htmlescape($text).
                "</textarea>";
                        
            if (self::$autoecho) {
                echo $html;
            }
            
            return $html;
        }
    }