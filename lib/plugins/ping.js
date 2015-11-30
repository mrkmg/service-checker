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
    return Promise
        .try(function ()
        {
            _.defaults(options, {
                host: "localhost",
                timeout: 5000
            });

            var pingCommand = "ping";

            var args = [options.host];

            /* istanbul ignore if */
            if (/^win/.test(process.platform))
            {
                args.push("-n", 1, "-w", options.timeout / 1000);
            }
            else
            {
                args.push("-c", 1, "-W", Math.ceil(options.timeout / 1000));
            }

            return child_process.spawn(pingCommand, args);
        })
        .then(function (ping_process)
        {
            return new Promise(function (resolve, reject)
            {
                ping_process.on("close", resolve);
                ping_process.on("error", reject);
            });
        })
        .then(function (code)
        {
            if (code === 0)
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
