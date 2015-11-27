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

    it("should resolve for valid Domain", function ()
    {
        return assert.isFulfilled(serviceChecker().http("localhost", 10000));
    });

    it("should reject for 404 error", function ()
    {
        return assert.isRejected(serviceChecker().http("localhost", 10001));
    });

    it("should reject for invalid Domain", function ()
    {
        return assert.isRejected(serviceChecker().http("invalid.domain"));
    });

    it("should reject for slow responding server", function ()
    {
        return assert.isRejected(serviceChecker({timeout: 1000}).http("localhost", 10002));
    });

    it("should reject if host is not a string", function ()
    {
        return assert.isRejected(serviceChecker().http(1));
    });
});
