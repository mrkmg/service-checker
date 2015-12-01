"use strict";

/**
 * server-checker : lib/checkers/ping
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var Promise = require("bluebird");
var _ = require("underscore");
var child_process = require("child_process");

module.exports = function ping(options)
{
    return Promise.resolve(options)
        .then(makeArguments)
        .then(function (args)
        {
            return spawnPing(args)
                .then(checkResult)
                .catch(_.constant);
        })
};

function makeArguments(options)
{
    options = _.defaults(options, {
        host: "localhost",
        timeout: 5000
    });

    if (!_.isString(options.host))
    {
        throw new Error("Host must be a string");
    }

    if (_.isString(options.timeout))
    {
        options.timeout = parseInt(options.timeout);
    }

    if (!_.isNumber(options.timeout))
    {
        throw new Error("timeout must be a number");
    }

    var args = [options.host];

    /* istanbul ignore if */
    if (/^win/.test(process.platform))
    {
        args.push("-n", 1, "-w", options.timeout);
    }
    else
    {
        args.push("-c", 1, "-W", Math.ceil(options.timeout / 1000));
    }

    return args;
}

function spawnPing(args)
{
    return Promise
        .try(function ()
        {
            var pingCommand = "ping";

            return child_process.spawn(pingCommand, args);
        })
        .then(function (ping_process)
        {
            return new Promise(function (resolve, reject)
            {
                ping_process.on("close", resolve);
                ping_process.on("error", reject);
            });
        });
}

function checkResult(code)
{
    if (code === 0)
    {
        return null;
    }
    else
    {
        var error = new Error("Request Exceed timeout of " + options.timeout + "ms");
        error.code = "TIMEOUT";
        throw error;
    }
}
