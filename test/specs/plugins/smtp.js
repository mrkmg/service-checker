"use strict";

/**
 * server-checker : test/specs/plugins/smtp
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var chai = require("chai");
chai.use(require("chai-as-promised"));
var assert = chai.assert;
var async = require("async");

var serviceChecker = require("../../..");

describe("PLUGIN: smtp", function ()
{
    var server_220 = require("../../fixtures/smtp/server-220")();
    var server_500 = require("../../fixtures/smtp/server-500")();
    var server_timeout = require("../../fixtures/smtp/server-timeout")();

    before("starting up test servers", function (done)
    {
        async.parallel([
            function (callback)
            {
                server_220.start(10000, callback);
            },
            function (callback)
            {
                server_500.start(10001, callback);
            },
            function (callback)
            {
                server_timeout.start(10002, callback);
            }
        ], done);

    });

    after("closing test servers", function (done)
    {
        async.parallel([
            function (callback)
            {
                server_220.stop(callback);
            },
            function (callback)
            {
                server_500.stop(callback);
            },
            function (callback)
            {
                server_timeout.stop(callback);
            }
        ], done);
    });

    it("should have method", function()
    {
        return assert.property(serviceChecker(), "smtp");
    });

    it("should resolve for valid server", function ()
    {
        return assert.isFulfilled(serviceChecker().smtp("localhost", 10000));
    });

    it("should reject for bad server", function ()
    {
        return assert.isRejected(serviceChecker().smtp("localhost", 10001));
    });

    it("should reject for invalid domain", function ()
    {
        return assert.isRejected(serviceChecker().smtp("invalid.domain"));
    });

    it("should reject due to timeout on slow server", function ()
    {
        return assert.isRejected(serviceChecker({timeout: 1000}).smtp("localhost", 10002));
    });

    it("should reject if host is not a string", function ()
    {
        return assert.isRejected(serviceChecker().smtp(1));
    });
});
