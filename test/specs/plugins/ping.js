"use strict";

/**
 * server-checker : test/specs/plugins/ping
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var chai = require("chai");
chai.use(require("chai-as-promised"));
var assert = chai.assert;

var serviceChecker = require("../../..");

describe("PLUGIN: ping", function ()
{
    it("should have method", function()
    {
        return assert.property(serviceChecker(), "ping");
    });

    it("should resolve for valid IP Address", function ()
    {
        return assert.isFulfilled(serviceChecker().ping("127.0.0.1"));
    });

    it("should resolve for valid Domain", function ()
    {
        return assert.isFulfilled(serviceChecker().ping("localhost"));
    });

    it("should reject for invalid IP Address", function ()
    {
        return assert.isRejected(serviceChecker().ping("127.0.0.256"));
    });

    it("should reject for invalid Domain", function ()
    {
        return assert.isRejected(serviceChecker().ping("hostname.invalid"));
    });

    it("should reject if host is not a string", function ()
    {
        return assert.isRejected(serviceChecker().ping(1));
    });

    it("should reject if host does not response to pings", function ()
    {
        return assert.isRejected(serviceChecker().ping("10.0.0.0"));
    });
});
