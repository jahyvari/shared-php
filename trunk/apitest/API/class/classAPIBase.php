<?php
    abstract class APIBase {
        /*
        * Funktion avulla APIBase luokasta periytyvä luokka voi kertoa
        * onko funktiokutsu ylipäätään API:n kautta kutsuttavissa.
        *
        * @param    string  $function   Funktion nimi
        * @return   bool
        */
        public static function isCallable($function) {
            return false;
        }
    }