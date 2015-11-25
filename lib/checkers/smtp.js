"use strict";

/**
 * server-checker : lib/checkers/smtp
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var Promise = require("bluebird");
var net = require("net");
var _ = require("underscore");

module.exports = smtp;

function smtp(host, port, options)
{
    if (!_.isObject(options)) options = {};

    options = _.defaults(options, {
        timeout: 5000
    });

    if (!_.isString(host)) throw new Exception("Host must be set and a string");
    if (!_.isNumber(port)) port = 25;

    return new Promise(function (resolve, reject)
    {
        var client = net.connect(port, host);

        var did_resolve = false;

        client.on("data", function (data)
        {
            if (did_resolve) return;

            did_resolve = true;

            if (data.toString().substr(0, 3) == "220")
                resolve();
            else
                reject("SMTPINVALIDRESPONSE");

            client.removeAllListeners("error");
            client.on("error", _.noop);
            client.destroy();
        });

        client.setTimeout(options.timeout, function ()
        {
            client.removeAllListeners("error");
            client.on("error", _.noop);
            client.destroy();

            reject("RequestTimedOutError");
        });

        client.on("error", function (error)
        {
            client.removeAllListeners("error");
            client.on("error", _.noop);
            client.destroy();

            reject(error.code);
        });

        client.end("QUIT");
    });
}
