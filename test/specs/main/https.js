"use strict";

/**
 * server-checker : test/specs/main/https
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var chai = require("chai");
var serviceChecker = require("../../..");

chai.use(require("chai-as-promised"));
var assert = chai.assert;

describe("MAIN: https", function ()
{
    it("should have method", function()
    {
        assert.property(serviceChecker(), "https");
    });

    it("should resolve for valid Domain", function ()
    {
        assert.isFulfilled(serviceChecker().https("google.com"));
    });

    it("should reject for invalid Domain", function ()
    {
        assert.isRejected(serviceChecker().https("hostname.invalid"));
    });

    it("should reject for expired ssl cert", function ()
    {
        assert.isRejected(serviceChecker().https("testssl-expire.disig.sk"));
    });
});
