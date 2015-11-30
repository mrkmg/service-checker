"use strict";

/**
 * server-checker : test/specs/plugins/raw-tcp
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var chai = require("chai");
chai.use(require("chai-as-promised"));
var assert = chai.assert;
var async = require("async");

var serviceChecker = require("../../..");

describe("PLUGIN: raw-tcp", function ()
{
    var server_open = require("../../fixtures/raw-tcp/server-open")();

    before("starting up test servers", function (done)
    {
        async.parallel([
            function (callback)
            {
                server_open.start(10000, callback);
            }
        ], done);

    });

    after("closing test servers", function (done)
    {
        async.parallel([
            function (callback)
            {
                server_open.stop(callback);
            }
        ], done);
    });

    it("should have method", function()
    {
        return assert.property(serviceChecker(), "rawTcp");
    });

    it("should return success:true for valid server", function ()
    {
        var options = {
            port: 10000
        };
        return assert.eventually.include(serviceChecker().rawTcp(options), {success: true});
    });

    it("should return success:false for bad server", function ()
    {
        var options = {
            port: 10001
        };
        return assert.eventually.include(serviceChecker().rawTcp(options), {success: false});
    });

    describe("disable net connect", function ()
    {
        var disable_net_connect_event = require("../../fixtures/raw-tcp/disable-net-connect-event")();

        before("disable net connect event", function (done)
        {
            disable_net_connect_event.start(done);
        });

        after("restore net connect event", function (done)
        {
            disable_net_connect_event.stop(done);
        });

        it("should return success:true on connect event timeout", function ()
        {
            var options = {
                port: 10000
            };
            return assert.eventually.include(serviceChecker({timeout: 1000}).rawTcp(options), {success: false});
        });
    });

    it("should return success:false for invalid Domain", function ()
    {
        var options = {
            host: "invalid.domain",
            port: 10000
        };
        return assert.eventually.include(serviceChecker().rawTcp(options), {success: false});
    });

    it("should reject for no port", function ()
    {
        var options = {};
        return assert.isRejected(serviceChecker().rawTcp(options));
    });
});
