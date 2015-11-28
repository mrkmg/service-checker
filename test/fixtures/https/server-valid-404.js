"use strict";

/**
 * server-checker : test/fixtures/https/server-valid-404
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var fs = require("fs");

module.exports = function ()
{
    var client = require("https").createServer({
        key: fs.readFileSync("test/fixtures/https/certs/valid.key"),
        cert: fs.readFileSync("test/fixtures/https/certs/valid.cert")
    }, function (request, response)
    {
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.end("Bad");
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
