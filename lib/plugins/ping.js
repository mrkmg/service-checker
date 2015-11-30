"use strict";

/**
 * server-checker : lib/checkers/ping
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var Promise = require("bluebird");
var _ = require("underscore");
var pinger = require("ping");

module.exports = function ping(options)
{
    return Promise
        .try(function ()
        {
            _.defaults(options, {
                host: "localhost",
                timeout: 5000
            });

            return options;
        }).then(function (options)
        {
            return pinger.promise.probe(options.host, {
                timeout: Math.min(1, options.timeout / 1000)
            });
        }).then(function (response)
        {
            if (response.alive)
            {
                return null;
            }
            else
            {
                var error = new Error("Request Exceed timeout of " + options.timeout + "ms");
                error.code = "TIMEOUT";
                return error;
            }
        });
};
