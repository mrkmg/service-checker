"use strict";

var chai = require("chai");
chai.use(require("chai-as-promised"));
var assert = chai.assert;

var serviceChecker = require("../../..");

describe("MAIN: http", function ()
{
    it("should have method", function()
    {
        assert.property(serviceChecker(), "http");
    });

    it("should resolve for valid Domain", function ()
    {
        assert.isFulfilled(serviceChecker().http("google.com"));
    });

    it("should reject for invalid Domain", function ()
    {
        assert.isRejected(serviceChecker().http("google.com"));
    });
});
