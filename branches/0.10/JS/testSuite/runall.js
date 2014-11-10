var fs      = require("fs");
var path    = require("path");
var exec    = require("child_process").exec;
var files   = [];

// Etsitään testitiedostot
var readdir = fs.readdirSync(__dirname);
if (readdir) {
    for (i in readdir) {
        if (/^test[\S]{1,}\.js$/.test(readdir[i])) {
            files.push(__dirname+
                path.sep+
                readdir[i]
            );
        }
    }
}

if (files.length == 0) {
    console.log("No test files!");
    process.exit(1);
}

var strRepeat = function(input,multiplier) {
    var result = "";    
    for (var i = 0; i < multiplier; i++) {
        result += input.toString();
    }    
    return result;
}

// Funktio ajaa testitiedostot läpi
var run = function() {
    if (files.length > 0) {
        var file = files.shift();
        var basename = path.basename(file);        
        var msg = "Running "+basename+strRepeat(" ",40-basename.length);
        
        process.stdout.write(msg);

        exec("node --harmony "+file,function(error,stdout,stderr){
           var msg = stdout;
           
           // Virhe -> keskeytetään
           if (error || msg != "") {
                var code = 1;
                if (msg == "") {
                    msg = "FAILED!\r\n";
                }
                if (error) {
                    code = error.code;
                }
                process.stdout.write(msg);
                process.exit(code);
           }
           
           process.stdout.write("OK!\r\n");
           
           run();
        });
    }
}

run();