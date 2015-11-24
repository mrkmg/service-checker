"use strict";

var chai = require("chai");
var serviceChecker = require("../../..");

chai.use(require("chai-as-promised"));
var assert = chai.assert;

describe("MAIN: checkPing", function ()
{
    it("should have method", function()
    {
        assert.property(serviceChecker(), "checkPing");
    });

    it("should resolve for valid IP Address", function ()
    {
        assert.isFulfilled(serviceChecker().checkPing("127.0.0.1"));
    });

    it("should resolve for valid Domain", function ()
    {
        assert.isFulfilled(serviceChecker().checkPing("localhost"));
    });

    it("should reject for invalid IP Address", function ()
    {
        assert.isRejected(serviceChecker().checkPing("127.0.0.256"));
    });

    it("should reject for invalid Domain", function ()
    {
        assert.isRejected(serviceChecker().checkPing("hostname.invalid"));
    });
});