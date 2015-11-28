"use strict";

/**
 * server-checker : lib/dns-lookup
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var Promise = require("bluebird");
var dns = require("dns");
var net = require("net");

module.exports = function (host)
{
    return new Promise(function (resolve, reject)
    {
        if (net.isIP(host) > 0)
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
