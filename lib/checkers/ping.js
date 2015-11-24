"use strict";

/**
 * server-checker : lib/checkers/ping
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var Promise = require("bluebird");
var _ = require("underscore");
var dnsLookup = require("../utils/dns-lookup");
var netPing = require("net-ping");

var session_id = 0;

module.exports = ping;

function ping(host, options)
{
    if (!_.isObject(options)) options = {};

    options = _.defaults(options, {
        timeout: 5000
    });

    return new Promise(function (resolve, reject)
    {
        session_id = ((session_id + 1) % 65534) + 1;

        var session = netPing.createSession({
            networkProtocol: netPing.NetworkProtocol.IPv4,
            packetSize: 84,
            retries: 0,
            sessionId: session_id,
            timeout: options.timeout,
            ttl: 60
        });

        dnsLookup(host)
            .then(function (address)
            {
                session.pingHost(address, function (err)
                {
                    if (err)
                    {
                        return reject(err);
                    }

                    session.close();
                    resolve();
                });
            })
            .catch (reject);
    });
}