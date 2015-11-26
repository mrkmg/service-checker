var serviceChecker = require("service-checker")();

serviceChecker.ping("8.8.8.8")
    .then(function (time){
        console.log("Google DNS is Up :-)");
        console.log("It took " + time + "ms to receive a reply.");
    })
    .catch(function (err){
        console.log("Google DNS is Down :-(");
        console.log(err);
    });

serviceChecker.https("google.com")
    .then(function (time){
        console.log("Google HTTPS is Up :-)");
        console.log("It took " + time + "ms to receive a reply.");
    })
    .catch(function (err){
        console.log("Google HTTPS is Down :-(");
        console.log(err);
    });

void(0);
