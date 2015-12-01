"use strict";

/**
 * server-checker : lib/checkers/http
 * Author: MrKMG (https://github.com/mrkmg)
 * Contributor: Sven Slootweg (joepie91) (http://cryto.net/~joepie91/)
 *
 * MIT License
 */

var Promise = require("bluebird");
var http_node = require("http");
var https_node = require("https");
var _ = require("underscore");

module.exports.http = function http(options)
{
    return run(options, false);
};

module.exports.https = function https(options)
{
    return run(options, true);
};

function run(options, ssl)
{
    return Promise
        .try(function ()
        {
            return makeRequest(options, ssl)
        })
        .then(function (request)
        {
            return runRequest(options, request)
                .then(checkResponse)
                .catch(_.constant);
        });
}

function makeRequest(options, ssl)
{
    options = _.defaults(options, {
        host: "localhost",
        port: ssl ? 443 : 80,
        method: "GET",
        path: "/",
        strictSSL: false,
        rejectUnauthorized: true,
        ca: null,
        timeout: 5000
    });

    var handler = ssl ? https_node : http_node;

    return handler.request(_.pick(options, [
        "host",
        "port",
        "method",
        "path",
        "strictSSL",
        "rejectUnauthorized",
        "ca"
    ]));
}

function runRequest(options, request)
{
    return new Promise(function (resolve, reject)
    {
        var request_timeout = setTimeout(doTimeout, options.timeout);

        function cancelEvent(event_name)
        {
            request.removeAllListeners(event_name);
            request.on(event_name, _.noop);
        }

        function cleanupRequest()
        {
            clearTimeout(request_timeout);
            cancelEvent("response");
            cancelEvent("error");
            request.destroy();
        }

        function doTimeout()
        {
            cleanupRequest();

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
    });
}

function checkResponse(response)
{
    if (response.statusCode >= 400)
    {
        var error = new Error("HTTP Status code in error range: " + response.statusCode);
        error.code = "HTTPSTATUSCODE";
        throw error;
    }

    return null;
}
