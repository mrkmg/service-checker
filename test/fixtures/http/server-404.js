"use strict";

/**
 * server-checker : test/fixtures/http/server-404
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

module.exports = function ()
{
    var client = require("http").createServer(function (request, response)
    {
        response.writeHead(404);
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