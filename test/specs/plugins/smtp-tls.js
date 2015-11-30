"use strict";

/**
 * server-checker : test/specs/plugins/smtp-tls
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var chai = require("chai");
chai.use(require("chai-as-promised"));
var assert = chai.assert;
var async = require("async");
var fs = require("fs");

var serviceChecker = require("../../..");

describe("PLUGIN: smtp-tls", function ()
{
    var server_valid = require("../../fixtures/smtp-tls/server-valid")();
    var server_error = require("../../fixtures/smtp-tls/server-error")();
    var server_timeout = require("../../fixtures/smtp-tls/server-timeout")();
    var server_expired = require("../../fixtures/smtp-tls/server-expired")();

    var valid_cert = fs.readFileSync("test/fixtures/smtp-tls/certs/valid.cert");
    var expired_cert = fs.readFileSync("test/fixtures/smtp-tls/certs/expired.cert");

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
                server_valid.stop(callback);
            },
            function (callback)
            {
                server_error.stop(callback);
            },
            function (callback)
            {
                server_timeout.stop(callback);
            },
            function (callback)
            {
                server_expired.stop(callback);
            }
        ], done);
    });

    it("should have method", function()
    {
        return assert.property(serviceChecker(), "smtpTls");
    });

    it("should return success:true for valid server", function ()
    {
        var options = {
            host: "localhost",
            port: 10000,
            ca: valid_cert
        };
        return assert.eventually.include(serviceChecker().smtpTls(options), {success: true});
    });

    it("should return success:false for bad server", function ()
    {
        var options = {
            port: 10001,
            ca: valid_cert
        };
        return assert.eventually.include(serviceChecker().smtpTls(options), {success: false});
    });

    it("should return success:false due to timeout on slow server", function ()
    {
        var options = {
            port: 10002,
            ca: valid_cert
        };
        return assert.eventually.include(serviceChecker({timeout: 1000}).smtpTls(options), {success: false});
    });

    it("should return success:false due to a expired cert", function ()
    {
        var options = {
            port: 10003,
            ca: expired_cert
        };
        return assert.eventually.include(serviceChecker({timeout: 1000}).smtpTls(options), {success: false});
    });

    it("should reject if bad parameter passed", function ()
    {
        var options = {
            host: true
        };
        return assert.isRejected(serviceChecker().smtpTls(options));
    });
});
