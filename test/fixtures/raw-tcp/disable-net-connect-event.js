"use strict";

/**
 * server-checker : test/fixtures/raw-tcp/disable-net-connect-event
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var _ = require("underscore");
var net = require("net");

module.exports = function ()
{
    var original_net_on = net.Socket.prototype.on;


    return {
        start: function (callback)
        {
            net.Socket.prototype.on = function (event)
            {
                if (event == "connect")
                {
                    return this;
                }

                return original_net_on.apply(this, _.toArray(arguments));
            };

            callback();
        },
        stop: function (callback)
        {
            net.Socket.prototype.on = original_net_on;
            callback();
        }
    };
};


