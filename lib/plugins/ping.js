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

module.exports = function ping(host, options)
{
    return Promise
        .try(function ()
        {
            /* Should always be given by service-checker */
            /* istanbul ignore if */
            if (!_.isObject(options)) options = {};

            options = _.defaults(options, {
                timeout: 5000
            });

            if (!_.isString(host))
            {
                throw new Error("Host must be set and a string");
            }

            return {
                timeout: options.timeout,
                host: host
            };
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
