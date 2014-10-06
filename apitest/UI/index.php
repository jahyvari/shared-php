<?php
    session_start();
    
    require_once(__DIR__.
        DIRECTORY_SEPARATOR.
        "inc".
        DIRECTORY_SEPARATOR.
        "incFunctions.php"
    );
?>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
        <script type="text/javascript" src="js/jsFunctions.js"></script>
    </head>    
    <body>
        <?php
            # Kutsutaan testifunktiota
            $call = apiCall("Test","testCall",array("param" => "PHP!"));
            echo "<pre>";
            echo "Kutsutaan testifunktiota PHP:llä...\n";
            echo "Code: {$call["code"]}\n";
            echo "Text: {$call["text"]}\n";
            echo "Data:\n";
            echo "-----\n";
            echo $call["data"];
            echo "</pre>";
        ?>
        <script type="text/javascript">            
            // Kutsutaan testivirhettä synkronisesti
            var result = API.Test.errorCall();
            var text = "Kutsutaan testivirhettä synkronisesti...\n"+
                "Code: "+result.code+"\n"+
                "Text: "+result.text;                
            $("<pre>").
                text(text).
                appendTo($("body"));                                

            // Kutsutaan olematonta funktiota asynkronisesti
            var test = new _API("Test");
            test.setAjaxOpt("async",true);
            test.setSuccessFunc(function(result) {                
                switch (this.functionName) {
                    case "testCaller":
                        var text = "Kutsutaan olematonta funktiota asynkronisesti...\n"+
                            "Code: "+result.code+"\n"+
                            "Text: "+result.text;
                        
                        $("<pre>").
                            text(text).
                            appendTo($("body"));
                        break;
                    default:
                        alert("Tuntematon funktio!");
                }
            });
            test.call("testCaller",{"param": "JS!"});
        </script>
    </body>
</html>