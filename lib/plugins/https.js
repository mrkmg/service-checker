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

function makeRequest(options)
{
    return new Promise(function (resolve, reject)
    {
        var request = https_node.request(options);
        var request_timeout = setInterval(doTimeout, options.timeout);

        function cancelEvent(eventName)
        {
            request.removeAllListeners(eventName);
            request.on(eventName, _.noop);
        }

        function cancelTimeout()
        {
            clearTimeout(request_timeout);
        }

        function cleanupRequest()
        {
            cancelTimeout();
            cancelEvent("error");
            request.destroy();
        }

        function doTimeout()
        {
            cancelEvent("response");
            cancelEvent("error");
            request.destroy();

            var err = new Error("Request exceeded timeout of " + options.timeout + "ms");
            err.code = "TIMEOUT";
            reject(err);
        }

        request.on("response", function (response)
        {
            cleanupRequest();
            resolve(response);
        });

        request.on("error", function (err)
        {
            cleanupRequest();
            reject(err);
        });

        request.end();
    })
}

module.exports = function https(host, port, ca, options)
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
                port = 443;
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
                followAllRedirects: false,
                port: port,
                method: "GET",
                strictSSL: false,
                rejectUnauthorized: true,
                ca: ca,
                timeout: options.timeout
            };
        }).then(function (options)
        {
            return makeRequest(options)
                .then(function (response)
                {
                    if (response.statusCode >= 400)
                    {
                        var error = new Error("HTTP Status code in error range: " + response.statusCode);
                        error.code = "HTTPSTATUSCODE";
                        return error;
                    }
                    else
                    {
                        return null;
                    }
                })
                .catch(function (error)
                {
                    return error;
                });
        });
};
