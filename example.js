var serviceChecker = require("service-checker")();

serviceChecker.ping("8.8.8.8")
    .then(function (result){

        if (result.success)
        {
            console.log("Google DNS is Up :-)");
            console.log("It took " + result.time + "ms to receive a reply.");
        }
        else
        {
            console.log("Google DNS is Down :-(");
            console.log(result.error);
        }

    })
    .catch(function (error){
        console.log("Other Error");
        console.log(error);
    });

serviceChecker.https("google.com")
    .then(function (result){

        if (result.success)
        {
            console.log("Google HTTPS is Up :-)");
            console.log("It took " + result.time + "ms to receive a reply.");
        }
        else
        {
            console.log("Google HTTPS is Down :-(");
            console.log(result.error);
        }

    })
    .catch(function (error){
        console.log("Other Error");
        console.log(error);
    });

void(0);
