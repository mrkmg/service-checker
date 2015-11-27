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

    it("should resolve for valid server", function ()
    {
        return assert.isFulfilled(serviceChecker().rawTcp("localhost", 10000));
    });

    it("should reject for bad server", function ()
    {
        return assert.isRejected(serviceChecker().rawTcp("localhost", 10001));
    });

    it("should reject for invalid domain", function ()
    {
        return assert.isRejected(serviceChecker().rawTcp("invalid.domain", 25));
    });

    it("should reject if host is not a string", function ()
    {
        return assert.isRejected(serviceChecker().rawTcp(1, 10));
    });

    it("should reject if port is not a number", function ()
    {
        return assert.isRejected(serviceChecker().rawTcp("localhost", "port"));
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

        it("should reject on connect event timeout", function ()
        {
            return assert.isRejected(serviceChecker({timeout: 1000}).rawTcp("localhost", 10000));
        });
    });
});
