"use strict";

/**
 * server-checker : lib/checkers/smtp
 * Author: MrKMG (https://github.com/mrkmg)
 * Contributor: Sven Slootweg (joepie91) (http://cryto.net/~joepie91/)
 *
 * MIT License
 */

var Promise = require("bluebird");
var net_node = require("net");
var _ = require("underscore");

module.exports = function rawTcp(options)
{
    return Promise.resolve(options)
        .then(makeRequest)
        .then(function (net_client)
        {
            return runRequest(options, net_client)
                .catch(_.identity);
        });
};

function makeRequest(options)
{
    options = _.defaults(options, {
        host:    "localhost",
        timeout: 5000
    });

    if (!_.has(options, "port"))
    {
        throw new Error("Port must be defined");
    }

    return net_node.connect(_.pick(options, [
        "host",
        "port"
    ]));
}

function runRequest(options, net_client)
{
    return new Promise(function (resolve, reject)
    {
        var request_timeout = setInterval(doTimeout, options.timeout);

        function cancelEvent(event_name)
        {
            net_client.removeAllListeners(event_name);
            net_client.on(event_name, _.noop);
        }

        function cleanupRequest()
        {
            clearTimeout(request_timeout);
            cancelEvent("data");
            cancelEvent("error");
            net_client.destroy();
        }

        function doTimeout()
        {
            cleanupRequest();

            var err = new Error("Request exceeded timeout of " + options.timeout + "ms");
            err.code = "TIMEOUT";
            reject(err);
        }

        net_client.on("connect", function ()
        {
            cleanupRequest();
            resolve();
        });

        net_client.on("error", function (err)
        {
            cleanupRequest();
            reject(err);
        });
    });
}
