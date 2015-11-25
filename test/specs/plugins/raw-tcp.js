"use strict";

/**
 * server-checker : test/specs/plugins/raw-tcp
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var chai = require("chai");
chai.use(require("chai-as-promised"));
var assert = chai.assert;
var async = require("async");

var serviceChecker = require("../../..");

describe("PLUGIN: raw-tcp", function ()
{
    var good_server;
    var bad_server;

    before("starting up test servers", function (done)
    {
        good_server = require("net").createServer(function (socket)
        {
            socket.end("Hello!");
        });

        good_server.listen(10000, done);
    });

    after("closing test servers", function ()
    {
        good_server.close();
    });

    it("should have method", function()
    {
        return assert.property(serviceChecker(), "rawTcp");
    });

    it("should resolve for valid server", function ()
    {
        return assert.isFulfilled(serviceChecker().rawTcp("localhost", 10000));
    });

    it("should reject for bad server", function ()
    {
        return assert.isRejected(serviceChecker().rawTcp("localhost", 10001));
    });

    it("should reject for invalid domain", function ()
    {
        return assert.isRejected(serviceChecker().rawTcp("invalid.domain"));
    });
});
