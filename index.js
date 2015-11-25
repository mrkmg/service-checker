"use strict";

/**
 * service-checker
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var _ = require("underscore");
var Promise = require("bluebird");

var errorMaps = require("./lib/utils/error-maps");

module.exports = serviceChecker;

var handlers = {
    ping: require("./lib/checkers/ping"),
    http: require("./lib/checkers/http"),
    https: require("./lib/checkers/https"),
    smtp: require("./lib/checkers/smtp")
};

function serviceChecker(opts)
{
    if (!_.isObject(opts)) opts = {};

    _.defaults(opts, {
        timeout: 5000
    });

    return {
        _name: "service-checker",
        ping: function (host)
        {
            return check("ping", host, {
                timeout: opts.timeout
            });
        },
        http: function (host, port)
        {
            return check("http", host, port, {
                timeout: opts.timeout
            });
        },
        https: function (host, port)
        {
            return check("https", host, port, {
                timeout: opts.timeout
            });
        },
        smtp: function (host, port)
        {
            return check("smtp", host, port, {
                timeout: opts.timeout
            })
        }
    };
}

function check(func)
{
    var options = _.values(arguments).slice(1);

    return new Promise(function (resolve, reject)
    {
        handlers[func].apply(null, options)
            .then(resolve)
            .catch(errorMaps)
            .then(reject);
    });
}
