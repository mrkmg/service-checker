"use strict";

/**
 * server-checker : lib/checkers/smtp
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var Promise = require("bluebird");
var net = require("net");
var _ = require("underscore");

function makeRequest(options)
{
    return new Promise(function (resolve, reject)
    {
        var net_client = net.connect(options.port, options.hostname);
        var request_timeout = setInterval(doTimeout, options.timeout);

        function cancelEvent(eventName)
        {
            net_client.removeAllListeners(eventName);
            net_client.on(eventName, _.noop);
        }

        function cancelTimeout()
        {
            clearTimeout(request_timeout);
        }

        function cleanupRequest()
        {
            cancelTimeout();
            cancelEvent("error");
            net_client.destroy();
        }

        function doTimeout()
        {
            cancelEvent("data");
            cancelEvent("error");
            net_client.destroy();

            var err = new Error("Request exceeded timeout of " + options.timeout + "ms");
            err.code = "TIMEOUT";
            reject(err);
        }

        net_client.on("data", function (data)
        {
            cleanupRequest();
            resolve(data);
        });

        net_client.on("error", function (err)
        {
            cleanupRequest();
            reject(err);
        });

        net_client.end("QUIT");
    })
}

module.exports = function smtp(host, port, options)
{
    return Promise
        .try(function ()
        {
            /* Should always be given by service-checker */
            /* istanbul ignore if */
            if (!_.isObject(options))
            {
                options = {};
            }

            options = _.defaults(options, {
                timeout: 5000
            });

            if (_.isUndefined(port) || _.isNull(port))
            {
                port = 25;
            }
            if (_.isString(port))
            {
                port = parseInt(port);
            }
            if (!_.isNumber(port) || _.isNaN(port))
            {
                throw new Error("Port must be a number");
            }
            if (!_.isString(host))
            {
                throw new Error("Host must be set and a string");
            }

            return {
                hostname: host,
                port: port,
                timeout: options.timeout
            };
        }).then(function (options)
        {
            return makeRequest(options)
                .then(function (data)
                {
                    if (data.toString().substr(0, 3) == "220")
                    {
                        return null;
                    }
                    else
                    {
                        var error = new Error("Invalid SMTP Response: " + data.toString());
                        error.code = "SMTPINVALIDRESPONSE";
                        return error;
                    }
                })
                .catch(function (error)
                {
                    return error;
                });
        });
};
