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
        var options = {
            port: 10000,
            ca: valid_cert
        };
        return assert.eventually.include(serviceChecker().https(options), {success: true});
    });

    it("should return success:false for self signed cert", function ()
    {
        var options = {
            port: 10000
        };
        return assert.eventually.include(serviceChecker().https(options), {success: false});
    });

    it("should return success:false for 404 response", function ()
    {
        var options = {
            port: 10001,
            ca: valid_cert
        };
        return assert.eventually.include(serviceChecker().https(options), {success: false});
    });

    it("should return success:false for slow responding server", function ()
    {
        var options = {
            port: 10002,
            ca: valid_cert
        };
        return assert.eventually.include(serviceChecker(options).https("localhost", 10002, valid_cert), {success: false});
    });

    it("should return success:false for expired ssl cert", function ()
    {
        var options = {
            port: 10003,
            ca: expired_cert
        };
        return assert.eventually.include(serviceChecker().https(options), {success: false});
    });

    it("should return success:false for invalid Domain", function ()
    {
        var options = {
            host: "invalid.domain"
        };
        return assert.eventually.include(serviceChecker().https(options), {success: false});
    });

    it("should reject if bad parameter passed", function ()
    {
        var options = {
            host: true
        };
        return assert.isRejected(serviceChecker().https(options));
    });
});
