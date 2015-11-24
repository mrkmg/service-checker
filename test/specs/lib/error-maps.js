"use strict";

var chai = require("chai");
var errorMaps = require("../../../lib/utils/error-maps");

chai.use(require("chai-as-promised"));
var assert = chai.assert;

describe("LIB: error-maps", function ()
{
    it("should be a function", function ()
    {
        assert.isFunction(errorMaps);
    });

    it("should reject on unknown error", function ()
    {
        return assert.isRejected(errorMaps("NONREAL_ERROR"));
    });

    it("should resolve for ECONNREFUSED", function ()
    {
        return assert.isFulfilled(errorMaps("ECONNREFUSED"));
    });

    it("should resolve for ENOTFOUND", function ()
    {
        return assert.isFulfilled(errorMaps("ENOTFOUND"));
    });

    it("should resolve for UNABLE_TO_VERIFY_LEAF_SIGNATURE", function ()
    {
        return assert.isFulfilled(errorMaps("UNABLE_TO_VERIFY_LEAF_SIGNATURE"));
    });

    it("should resolve for CERT_HAS_EXPIRED", function ()
    {
        return assert.isFulfilled(errorMaps("CERT_HAS_EXPIRED"));
    });

    it("should resolve for EHOSTUNREACH", function ()
    {
        return assert.isFulfilled(errorMaps("EHOSTUNREACH"));
    });

    it("should resolve for DNSNOTFOUND", function ()
    {
        return assert.isFulfilled(errorMaps("DNSNOTFOUND"));
    });

    it("should resolve for RequestTimedOutError", function ()
    {
        return assert.isFulfilled(errorMaps("RequestTimedOutError"));
    });
});