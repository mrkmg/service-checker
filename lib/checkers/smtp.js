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

module.exports = function smtp(host, port, options)
{
    /* Should always be given by service-checker */
    /* istanbul ignore if */
    if (!_.isObject(options)) options = {};

    options = _.defaults(options, {
        timeout: 5000
    });

    if (!_.isString(host)) throw new Error("Host must be set and a string");
    if (!_.isNumber(port)) port = 25;

    return new Promise(function (resolve, reject)
    {
        var client = net.connect(port, host);

        var did_resolve = false;

        var timeout_id = setTimeout(function ()
        {
            client.removeAllListeners("data");
            client.removeAllListeners("error");
            client.on("data", _.noop);
            client.on("error", _.noop);
            client.destroy();

            reject(new Error("Timeout"))
        }, options.timeout);

        client.on("data", function (data)
        {
            /* This is a very rare edge case */
            /* istanbul ignore if */
            if (did_resolve) return;

            clearTimeout(timeout_id);
            did_resolve = true;

            if (data.toString().substr(0, 3) == "220")
                resolve();
            else
                reject("SMTPINVALIDRESPONSE");

            client.removeAllListeners("error");
            client.on("error", _.noop);
            client.destroy();
        });

        client.on("error", function (error)
        {
            clearTimeout(timeout_id);
            client.removeAllListeners("error");
            client.on("error", _.noop);
            client.destroy();

            reject(error.code);
        });

        client.end("QUIT");
    });
};
