"use strict";

/**
 * server-checker : lib/dns-lookup
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var Promise = require("bluebird"),
    dns = require("dns");

var ip_regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

module.exports = function (host)
{
    return new Promise(function (resolve, reject)
    {
        if (ip_regex.test(host))
        {
            resolve(host);
        }
        else
        {
            dns.lookup(host, function (err, address)
            {
                if (err)
                {
                    return reject(err);
                }

                resolve(address);
            });
        }
    });
};