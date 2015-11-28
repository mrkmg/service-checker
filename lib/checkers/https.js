"use strict";

/**
 * server-checker : lib/checkers/http
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var Promise = require("bluebird");
var https_node = require("https");
var _ = require("underscore");

module.exports = function https(host, port, ca, options)
{
    /* Should always be given by service-checker */
    /* istanbul ignore if */
    if (!_.isObject(options)) options = {};

    options = _.defaults(options, {
        timeout: 5000
    });

    if (!_.isNumber(port)) port = 443;

    if (!_.isString(host)) throw new Error("Host must be set and a string");

    return new Promise(function (resolve)
    {
        var client = https_node.request({
            hostname: host,
            followAllRedirects: false,
            port: port,
            method: "GET",
            strictSSL: false,
            rejectUnauthorized: true,
            ca: ca
        });

        var timeout_id = setTimeout(function ()
        {
            client.removeAllListeners("response");
            client.removeAllListeners("error");
            client.on("response", _.noop);
            client.on("error", _.noop);
            client.destroy();

            var err = new Error("Request Exceed timeout of " + options.timeout + "ms");
            err.code = "TIMEOUT";
            resolve(err);
        }, options.timeout);

        client.on("response", function (response)
        {
            clearTimeout(timeout_id);

            client.removeAllListeners("error");
            client.on("error", _.noop);
            client.destroy();

            if (response.statusCode >= 400)
            {
                var err = new Error("HTTP Status code in error range: " + response.statusCode);
                err.code = "HTTPSTATUSCODE";
                resolve(err);
            }
            else
            {
                resolve();
            }
        });

        client.on("error", function (err)
        {
            clearTimeout(timeout_id);

            client.removeAllListeners("error");
            client.on("error", _.noop);
            client.destroy();

            resolve(err);
        });

        client.end();
    });
};
