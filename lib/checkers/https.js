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

module.exports = https;

function https(host, port, options)
{
    if (!_.isObject(options)) options = {};

    options = _.defaults(options, {
        timeout: 5000
    });

    if (!_.isNumber(port)) port = 443;

    return new Promise(function (resolve, reject)
    {
        var client = https_node.request({
            hostname: host,
            followAllRedirects: false,
            port: port,
            method: "GET",
            strictSSL: false,
            rejectUnauthorized: true
        }, function (response)
        {
            if (response.statusCode >= 400)
            {
                reject("HTTPSTATUSCODE");
            }
            else
            {
                resolve();
            }

            client.removeAllListeners("error");
            client.on("error", _.noop);
            client.destroy();
        });

        client.on("socket", function(socket)
        {
            socket.setTimeout(options.timeout, function ()
            {
                reject("RequestTimedOutError");
                client.removeAllListeners("error");
                client.on("error", _.noop);
                client.destroy();
            });
        });

        client.on("error", function (err)
        {
            reject(err.code);
            client.removeAllListeners("error");
            client.on("error", _.noop);
            client.destroy();
        });

        client.end();
    });
}
