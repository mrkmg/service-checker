"use strict";

/**
 * server-checker : lib/checkers/raw-tcp
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var Promise = require("bluebird");
var net = require("net");
var _ = require("underscore");

module.exports = function rawTcp(host, port, options)
{
    if (!_.isObject(options)) options = {};

    options = _.defaults(options, {
        timeout: 5000
    });

    if (!_.isString(host)) throw new Exception("Host must be set and a string");
    if (!_.isNumber(port)) throw new Exception("Port must be set and a number");

    return new Promise(function (resolve, reject)
    {
        var client = net.connect(port, host, function ()
        {
            client.removeAllListeners("error");
            client.on("error", _.noop);
            client.destroy();

            resolve();
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
};