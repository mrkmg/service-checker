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

    it("should return success:true for valid IP Address", function ()
    {
        return assert.eventually.include(serviceChecker().ping("127.0.0.1"), {success: true});
    });

    it("should return success:true for valid Domain", function ()
    {
        return assert.eventually.include(serviceChecker().ping("localhost"), {success: true});
    });

    it("should return success:false if host does not response to pings", function ()
    {
        return assert.eventually.include(serviceChecker().ping("10.0.0.0"), {success: false});
    });

    it("should return success:false for invalid IP Address", function ()
    {
        return assert.eventually.include(serviceChecker().ping("127.0.0.256"), {success: false});
    });

    it("should return success:false for invalid Domain", function ()
    {
        return assert.eventually.include(serviceChecker().ping("invalid.domain"), {success: false});
    });

    it("should reject if host is not a string", function ()
    {
        return assert.isRejected(serviceChecker().ping(1));
    });
});
