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
    /* Should always be given by service-checker */
    /* istanbul ignore if */
    if (!_.isObject(options)) options = {};

    options = _.defaults(options, {
        timeout: 5000
    });

    if (_.isString(port)) port = parseInt(port);
    if (!_.isNumber(port) || _.isNaN(port)) throw new Error("Port must be a number");
    if (!_.isString(host)) throw new Error("Host must be set and a string");

    return new Promise(function (resolve)
    {
        var client = net.connect(port, host);

        var timeout_id = setTimeout(function ()
        {
            client.removeAllListeners("data");
            client.removeAllListeners("error");
            client.on("data", _.noop);
            client.on("error", _.noop);
            client.destroy();

            var err = new Error("Request Exceed timeout of " + options.timeout + "ms");
            err.code = "TIMEOUT";
            resolve(err);
        }, options.timeout);

        client.on("connect", function ()
        {
            clearTimeout(timeout_id);

            client.removeAllListeners("error");
            client.on("error", _.noop);
            client.destroy();

            resolve();
        });

        client.on("error", function (error)
        {
            clearTimeout(timeout_id);

            client.removeAllListeners("error");
            client.on("error", _.noop);
            client.destroy();

            resolve(error);
        });

        client.end("QUIT");
    });
};
