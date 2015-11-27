"use strict";

/**
 * server-checker : test/fixtures/smtp/server-500
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

module.exports = function ()
{
    var client = require("net").createServer(function (socket)
    {
        socket.end("500 Error Server");
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