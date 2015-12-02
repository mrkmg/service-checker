"use strict";

/**
 * server-checker : test/fixtures/https/server-expired
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var fs = require("fs");

module.exports = function ()
{
    var client = require("https").createServer({
        key: fs.readFileSync("test/fixtures/https/certs/expired.key"),
        cert: fs.readFileSync("test/fixtures/https/certs/expired.cert")
    }, function (request, response)
    {
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.end("Good");
    });

    return {
        start: function (port, callback)
        {
            client.listen(port, callback);
        },
        stop: function (callback)
        {
            client.close(callback);
        }
    };
};
