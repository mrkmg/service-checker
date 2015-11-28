"use strict";

/**
 * server-checker : test/fixtures/https/server-valid-timeout
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
        //Wait forever to send response
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
