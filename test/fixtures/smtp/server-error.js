"use strict";

/**
 * server-checker : test/fixtures/smtp/server-error
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var SMTPServer = require('smtp-server').SMTPServer;
var _ = require("underscore");

module.exports = function ()
{
    var client = new SMTPServer({
        secure:false,
        logger : false,
        hideSTARTTLS: true,
        onConnect: function (session, callback)
        {
            callback(new Error());
        }
    });

    return {
        start: function (port, callback)
        {
            client.listen(port, "localhost", callback);
        },
        stop: function (callback)
        {
            if (!_.isFunction(callback)) callback = _.noop;
            client.close(callback);
        }
    };
};
