"use strict";

/**
 * server-checker : test/specs/main/https
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 *
 * TODO: Add servers for tests, would require valid, expired, and self-signed certs.
 */

var chai = require("chai");
var serviceChecker = require("../../..");

chai.use(require("chai-as-promised"));
var assert = chai.assert;

describe("MAIN: https", function ()
{
    it("should have method", function()
    {
        return assert.property(serviceChecker(), "https");
    });

    it("should resolve for valid Domain", function ()
    {
        return assert.isFulfilled(serviceChecker().https("google.com"));
    });

    it("should reject for invalid Domain", function ()
    {
        return assert.isRejected(serviceChecker().https("invalid.domain"));
    });

    it("should reject for expired ssl cert", function ()
    {
        return assert.isRejected(serviceChecker().https("testssl-expire.disig.sk"));
    });

    it("should reject for self signed cert", function ()
    {
        return assert.isRejected(serviceChecker().https("www.pcwebshop.co.uk"));
    })
});
