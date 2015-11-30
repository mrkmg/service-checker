"use strict";

/**
 * server-checker : test/specs/plugins/http
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var chai = require("chai");
chai.use(require("chai-as-promised"));
var assert = chai.assert;
var async = require("async");

var serviceChecker = require("../../..");

describe("PLUGIN: http", function ()
{
    var server_200 = require("../../fixtures/http/server-200")();
    var server_404 = require("../../fixtures/http/server-404")();
    var server_timeout = require("../../fixtures/http/server-timeout")();

    before("starting up test servers", function (done)
    {
        async.parallel([
            function (callback)
            {
                server_200.start(10000, callback);
            },
            function (callback)
            {
                server_404.start(10001, callback);
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
                server_200.stop(callback);
            },
            function (callback)
            {
                server_404.stop(callback);
            },
            function (callback)
            {
                server_timeout.stop(callback);
            }
        ], done);
    });

    it("should have method", function ()
    {
        return assert.property(serviceChecker(), "http");
    });

    it("should return success:true for properly responding server", function ()
    {
        var options = {
            port: 10000
        };
        return assert.eventually.include(serviceChecker().http(options), {success: true});
    });

    it("should return success:false for 404 error", function ()
    {
        var options = {
            port: 10001
        };
        return assert.eventually.include(serviceChecker().http(options), {success: false});
    });

    it("should return success:false for slow responding server (timeout)", function ()
    {
        var options = {
            port: 10002
        };
        return assert.eventually.include(serviceChecker({timeout: 1000}).http(options), {success: false});
    });

    it("should reject if bad parameter passed", function ()
    {
        var options = {
            host: true
        };
        return assert.isRejected(serviceChecker().http(options));
    });
});
