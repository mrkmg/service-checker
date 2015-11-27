"use strict";

/**
 * server-checker : test/specs/plugins/https
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

describe("PLUGIN: https", function ()
{
    var no_response_server;

    before("starting up test servers", function (done)
    {
        no_response_server = require("net").createServer(function (socket)
        {
            //Do not send a response
        });

        no_response_server.listen(10000, done);
    });

    after("closing test servers", function ()
    {
        no_response_server.close();
    });

    it("should have method", function()
    {
        return assert.property(serviceChecker(), "https");
    });

    it("should return success:true for good host", function ()
    {
        return assert.eventually.include(serviceChecker().https("google.com"), {success: true});
    });

    it("should return success:false for expired ssl cert", function ()
    {
        return assert.eventually.include(serviceChecker().https("testssl-expire.disig.sk"), {success: false});
    });

    it("should return success:false for self signed cert", function ()
    {
        return assert.eventually.include(serviceChecker().https("www.pcwebshop.co.uk"), {success: false});
    });

    it("should return success:false for slow responding server", function ()
    {
        return assert.eventually.include(serviceChecker({timeout: 1000}).https("localhost", 10000), {success: false});
    });

    //TODO: Add test for invalid status code

    it("should return success:false for invalid Domain", function ()
    {
        return assert.eventually.include(serviceChecker().https("invalid.domain"), {success: false});
    });

    it("should reject if host is not a string", function ()
    {
        return assert.isRejected(serviceChecker().https(1));
    });
});
