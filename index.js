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

var _options = {
    timeout: 5000
};

var handlers = {
    ping: require("./lib/checkers/ping")
};

function serviceChecker(opts)
{
    applyOptions(opts);

    return {
        _name: "service-checker",
        checkPing: function (host)
        {
            return check("ping", host, {
                timeout: _options.timeout
            });
        }
    };
}

function applyOptions(opts)
{
    _options = _.extend(_options, _.pick(opts, [
        "timeout"
    ]));
}

function check(func)
{
    var options = _.values(arguments).slice(1);

    return new Promise(function (resolve, reject)
    {
        handlers[func].apply(null, options)
            .then(resolve)
            .catch(function (err)
            {
                errorMaps(err).then(reject).catch(function (err)
                {
                    console.warn("Unknown Error: " + err);
                    console.warn("Please report this as a bug.");
                    reject("Unknown Error", err);
                });
            });
    });
}