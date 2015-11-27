"use strict";

/**
 * server-checker : test/fixtures/http/server-200
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

module.exports = function ()
{
    var client = require("http").createServer(function (request, response)
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