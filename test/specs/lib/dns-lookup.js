"use strict";

/**
 * server-checker : test/specs/lib/dns-lookup
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var chai = require("chai");
var dnsLookup = require("../../../lib/utils/dns-lookup");

chai.use(require("chai-as-promised"));
var assert = chai.assert;

describe("LIB: dns-lookup", function ()
{
    it("should be a function", function ()
    {
        return assert.isFunction(dnsLookup);
    });

    it("should return a valid IP as is", function ()
    {
        return assert.eventually.equal(dnsLookup("8.8.8.8"), "8.8.8.8");
    });

    it("should reject an invalid IP", function ()
    {
        return assert.isRejected(dnsLookup("1.2.3.256"));
    });

    it("should resolve a valid domain", function ()
    {
        return assert.isFulfilled(dnsLookup("google.com"));
    });

    it("should reject an invalid domain", function ()
    {
        return assert.isRejected(dnsLookup("invalid.domain"));
    })
});