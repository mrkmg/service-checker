"use strict";

/**
 * server-checker : test/fixtures/http/server-timeout
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

module.exports = function ()
{
    var client = require("http").createServer(function (request, response)
    {
        //Do not reply
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