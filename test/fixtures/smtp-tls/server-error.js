"use strict";

/**
 * server-checker : test/fixtures/smtp-tls/server-error
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var SMTPServer = require('smtp-server').SMTPServer;
var _ = require("underscore");
var fs = require("fs");

module.exports = function ()
{
    var client = new SMTPServer({
        secure:false,
        logger : false,
        hideSTARTTLS: true,
        onConnect: function (session, callback)
        {
            callback(new Error());
        },
        key: fs.readFileSync("test/fixtures/smtp-tls/certs/valid.key"),
        cert: fs.readFileSync("test/fixtures/smtp-tls/certs/valid.cert")
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
