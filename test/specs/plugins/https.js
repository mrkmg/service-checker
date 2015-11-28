"use strict";

/**
 * server-checker : test/specs/plugins/https
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 *
 * TODO: Add servers for tests, would require valid, expired, and self-signed certs.
 */

var chai = require("chai");
var serviceChecker = require("../../..");
var fs = require("fs");
var async = require("async");

chai.use(require("chai-as-promised"));
var assert = chai.assert;

describe("PLUGIN: https", function ()
{
    var server_valid_200 = require("../../fixtures/https/server-valid-200")();
    var server_valid_404 = require("../../fixtures/https/server-valid-404")();
    var server_valid_timeout = require("../../fixtures/https/server-valid-timeout")();
    var server_expired = require("../../fixtures/https/server-expired")();

    var valid_cert = fs.readFileSync("test/fixtures/https/certs/valid.cert");
    var expired_cert = fs.readFileSync("test/fixtures/https/certs/expired.cert");

    before("starting up test servers", function (done)
    {
        async.parallel([
            function (callback)
            {
                server_valid_200.start(10000, callback);
            },
            function (callback)
            {
                server_valid_404.start(10001, callback);
            },
            function (callback)
            {
                server_valid_timeout.start(10002, callback);
            },
            function (callback)
            {
                server_expired.start(10003, callback);
            }
        ], done);
    });

    after("closing test servers", function (done)
    {
        async.parallel([
            function (callback)
            {
                server_valid_200.stop(callback);
            },
            function (callback)
            {
                server_valid_404.stop(callback);
            },
            function (callback)
            {
                server_valid_timeout.stop(callback);
            },
            function (callback)
            {
                server_expired.stop(callback);
            }
        ], done);
    });

    it("should have method", function()
    {
        return assert.property(serviceChecker(), "https");
    });

    it("should return success:true for good host", function ()
    {
        return assert.eventually.include(serviceChecker().https("localhost", 10000, valid_cert), {success: true});
    });

    it("should return success:false for self signed cert", function ()
    {
        return assert.eventually.include(serviceChecker().https("localhost", 10000), {success: false});
    });

    it("should return success:false for 404 response", function ()
    {
        return assert.eventually.include(serviceChecker().https("localhost", 10001, valid_cert), {success: false});
    });

    it("should return success:false for slow responding server", function ()
    {
        return assert.eventually.include(serviceChecker({timeout: 1000}).https("localhost", 10002, valid_cert), {success: false});
    });

    it("should return success:false for expired ssl cert", function ()
    {
        return assert.eventually.include(serviceChecker().https("localhost", 10003, expired_cert), {success: false});
    });

    it("should return success:false for invalid Domain", function ()
    {
        return assert.eventually.include(serviceChecker().https("invalid.domain"), {success: false});
    });

    it("should reject if host is not a string", function ()
    {
        return assert.isRejected(serviceChecker().https(1));
    });

    it("should parse valid string port", function ()
    {
        return assert.isFulfilled(serviceChecker().https("localhost", "10000"));
    });

    it("should reject if port is not a number", function ()
    {
        return assert.isRejected(serviceChecker().https("localhost", "a"));
    });
});
