"use strict";
/**
 * service-checker : error-maps.js
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var async = require("async");
var Promise = require("bluebird");
var _ = require("underscore");

var error_map = [
    {
        code: "CONNECTION_REFUSED",
        message: "Connection Refused",
        regex: /ECONNREFUSED/
    },
    {
        code: "DNS_NOT_FOUND",
        message: "DNS Lookup Failed",
        regex: /ENOTFOUND/
    },
    {
        code: "INVALID_SSL_CERT",
        message: "SSL Certificate is invalid",
        regex: /UNABLE_TO_VERIFY_LEAF_SIGNATURE/
    },
    {
        code: "EXPIRED_CERT",
        message: "SSL Certificate has expired",
        regex: /CERT_HAS_EXPIRED/
    },
    {
        code: "HOST_UNREACHABLE",
        message: "The host is unreachable",
        regex: /EHOSTUNREACH/
    },
    {
        code: "DNS_NOT_FOUND",
        message: "Failed to resolve the host",
        regex: /DNSNOTFOUND/
    },
    {
        code: "REQUEST_TIMEOUT",
        message: "The request timed out",
        regex: /RequestTimedOutError/
    },
    {
        code: "HTTP_STATUS",
        message: "Http status code invalid",
        regex: /HTTPSTATUSCODE/
    }
];

module.exports = function (error_string)
{
    return new Promise(function (resolve, reject)
    {
        async.detect(error_map, function (error_object, callback)
        {
            callback(error_object.regex.test(error_string));
        },
        function (result)
        {
            if (typeof result === "undefined")
            {
                resolve({
                    code: "UNKNOWN_ERROR",
                    message: error_string
                });
            }
            else
            {
                resolve(_.pick(result, [
                    "code",
                    "message"
                ]));
            }
        });
    });
};
