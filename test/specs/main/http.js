"use strict";

/**
 * server-checker : test/specs/main/http
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var chai = require("chai");
chai.use(require("chai-as-promised"));
var assert = chai.assert;

var serviceChecker = require("../../..");

describe("MAIN: http", function ()
{
    it("should have method", function()
    {
        return assert.property(serviceChecker(), "http");
    });

    it("should resolve for valid Domain", function ()
    {
        return assert.isFulfilled(serviceChecker().http("google.com"));
    });

    it("should reject for invalid Domain", function ()
    {
        return assert.isRejected(serviceChecker().http("invalid.domain"));
    });
});
