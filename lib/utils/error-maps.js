"use strict";
/**
 * service-checker : error-maps.js
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var async = require("async"),
    Promise = require("bluebird");

var error_map = [
    {
        id: "CONNECTION_REFUSED",
        description: "Connection Refused",
        regex: /ECONNREFUSED/
    },
    {
        id: "DNS_NOT_FOUND",
        description: "DNS Lookup Failed",
        regex: /ENOTFOUND/
    },
    {
        id: "SELF_SIGNED_CERT",
        description: "SSL Certificate is self-signed",
        regex: /UNABLE_TO_VERIFY_LEAF_SIGNATURE/
    },
    {
        id: "EXPIRED_CERT",
        description: "SSL Certificate has expired",
        regex: /CERT_HAS_EXPIRED/
    },
    {
        id: "HOST_UNREACHABLE",
        description: "The host is unreachable",
        regex: /EHOSTUNREACH/
    },
    {
        id: "DNS_NOT_FOUND",
        description: "Failed to resolve the host",
        regex: /DNSNOTFOUND/
    },
    {
        id: "REQUEST_TIMEOUT",
        description: "The request timed out",
        regex: /RequestTimedOutError/
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
                reject("Unknown Error", error_string);
            }
            else
            {
                resolve(result.id, result.description);
            }
        });
    });
};
