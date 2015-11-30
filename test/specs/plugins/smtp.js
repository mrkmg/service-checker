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
    var server_valid = require("../../fixtures/smtp/server-valid")();
    var server_error = require("../../fixtures/smtp/server-error")();
    var server_timeout = require("../../fixtures/smtp/server-timeout")();

    before("starting up test servers", function (done)
    {
        async.parallel([
            function (callback)
            {
                server_valid.start(10000, callback);
            },
            function (callback)
            {
                server_error.start(10001, callback);
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
                server_valid.stop(callback);
            },
            function (callback)
            {
                server_error.stop(callback);
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

    it("should return success:true for valid server", function ()
    {
        var options = {
            host: "localhost",
            port: 10000
        };
        return assert.eventually.include(serviceChecker().smtp(options), {success: true});
    });

    it("should return success:false for bad server", function ()
    {
        var options = {
            port: 10001
        };
        return assert.eventually.include(serviceChecker().smtp(options), {success: false});
    });

    it("should return success:false due to timeout on slow server", function ()
    {
        var options = {
            port: 10002
        };
        return assert.eventually.include(serviceChecker({timeout: 1000}).smtp(options), {success: false});
    });

    it("should reject if bad host parameter passed", function ()
    {
        var options = {
            host: true
        };
        return assert.isRejected(serviceChecker().smtp(options));
    });

    it("should reject if bad port parameter passed", function ()
    {
        var options = {
            port: true
        };
        return assert.isRejected(serviceChecker().smtp(options));
    });
});
