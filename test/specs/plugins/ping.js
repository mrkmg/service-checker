"use strict";

/**
 * server-checker : test/specs/plugins/ping
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var os = require("os");
var chai = require("chai");
chai.use(require("chai-as-promised"));
var assert = chai.assert;

var serviceChecker = require("../../..");

describe("PLUGIN: ping", function ()
{
    it("should have method", function ()
    {
        return assert.property(serviceChecker(), "ping");
    });

    it("should return success:true for valid IP Address", function ()
    {
        var options = {
            host: "127.0.0.1"
        };
        return assert.eventually.propertyVal(serviceChecker().ping(options), "success", true);
    });

    it("should return success:true for valid Domain", function ()
    {
        var options = {
            host: "localhost"
        };
        return assert.eventually.propertyVal(serviceChecker().ping(options), "success", true);
    });

    it("should return success:false if host does not response to pings", function ()
    {
        var options = {
            host:    "169.254.0.0",
            timeout: 1000
        };
        return assert.eventually.deepPropertyVal(serviceChecker().ping(options), "error.code", "TIMEOUT");
    });

    it("should return success:false for invalid IP Address", function ()
    {
        var options = {
            host: "127.0.0.256"
        };
        return assert.eventually.propertyVal(serviceChecker().ping(options), "success", false);
    });

    it("should return success:false for invalid Domain", function ()
    {
        var options = {
            host: "invalid.domain"
        };
        return assert.eventually.propertyVal(serviceChecker().ping(options), "success", false);
    });

    it("should reject if host is not a string", function ()
    {
        var options = {
            host: 1
        };
        return assert.isRejected(serviceChecker().ping(options));
    });

    it("should reject if timeout is not a number", function ()
    {
        var options = {
            host:    "localhost",
            timeout: "ABC"
        };
        return assert.isRejected(serviceChecker().ping(options));
    });
});
