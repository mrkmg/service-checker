var serviceChecker = require("service-checker")();

serviceChecker.ping("8.8.8.8")
    .then(function (){
        console.log("Google DNS is Up :-)");
    })
    .catch(function (){
        console.log("Google DNS is Down :-(");
    });

serviceChecker.https("google.com")
    .then(function (){
        console.log("Google HTTPS is Up :-)");
    })
    .catch(function (){
        console.log("Google HTTPS is Down :-(");
    });

void(0);