"use strict";

/**
 * server-checker : lib/checkers/ping
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var Promise = require("bluebird");
var _ = require("underscore");
var dnsLookup = require("../utils/dns-lookup");
var pinger = require("ping");

module.exports = function ping(host, options)
{
    /* Should always be given by service-checker */
    /* istanbul ignore if */
    if (!_.isObject(options)) options = {};

    options = _.defaults(options, {
        timeout: 5000
    });

    if (!_.isString(host)) throw new Error("Host must be set and a string");

    return new Promise(function (resolve, reject)
    {
        dnsLookup(host)
            .then(function (address)
            {
                pinger.promise.probe(address, {
                    timeout: Math.min(1, options.timeout/1000)
                })
                    .then(function (response)
                    {
                        if (response.alive)
                        {
                            resolve();
                        }
                        else
                        {
                            //TODO, parse for actual reason
                            var err = new Error("Request Exceed timeout of " + options.timeout + "ms");
                            err.code = "TIMEOUT";
                            resolve(err);
                        }
                    })
                    .catch(reject);
            })
            .catch(resolve);
    });
};
