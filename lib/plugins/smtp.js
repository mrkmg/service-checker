"use strict";

/**
 * server-checker : lib/checkers/smtp
 * Author: MrKMG (https://github.com/mrkmg)
 * Contributor: Sven Slootweg (joepie91) (http://cryto.net/~joepie91/)
 *
 * MIT License
 */

var Promise = require("bluebird");
var smtpConnection = require("smtp-connection");
var _ = require("underscore");

module.exports.smtp = function smtp(options)
{
    return run(options, false);
};

module.exports.smtpTls = function smtpTls(options)
{
    return run(options, true);
};

function run(options, tls)
{
    return Promise
        .try(function ()
        {
            return makeRequest(options, tls)
        })
        .then(function (request)
        {
            return runRequest(options, request)
                .catch(_.constant);
        });
}

function makeRequest(options, tls)
{
    options = _.defaults(options, {
        host: "localhost",
        port: 25,
        ca: null,
        timeout: 5000
    });

    if (!(_.isString(options.host) || !options.host))
    {
        throw new Error("Hostname but be a string or falsey");
    }

    if (!(_.isNumber(options.port) || !options.port))
    {
        throw new Error("Port but be a number or falsey");
    }

    if (tls)
    {
        options.requireTLS = true;
        options.ignoreTLS = false;
        options.tls = {
            ca: options.ca
        };
    }
    else
    {
        options.requireTLS = false;
        options.ignoreTLS = true;
    }

    return new smtpConnection(_.pick(options, [
        "host",
        "port",
        "tls"
    ]));
}

function runRequest(options, request)
{
    return new Promise(function (resolve, reject)
    {
        var request_timeout = setInterval(doTimeout, options.timeout);

        function cancelEvent(event_name)
        {
            request.removeAllListeners(event_name);
            request.on(event_name, _.noop);
        }

        function cleanupRequest()
        {
            clearTimeout(request_timeout);
            cancelEvent("data");
            cancelEvent("error");
            request.close();
        }

        function doTimeout()
        {
            cleanupRequest();

            var err = new Error("Request exceeded timeout of " + options.timeout + "ms");
            err.code = "TIMEOUT";
            reject(err);
        }

        request.on("log", console.log);

        request.on("connect", function ()
        {
            cleanupRequest();
            resolve();
        });

        request.on("error", function (err)
        {
            cleanupRequest();
            reject(err);
        });

        request.connect();
    });
}
