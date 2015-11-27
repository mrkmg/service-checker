"use strict";

/**
 * server-checker : test/fixtures/raw-tcp/server-open
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

module.exports = function ()
{
    var client = require("net").createServer(function (socket)
    {
        socket.end("Hello!");
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


