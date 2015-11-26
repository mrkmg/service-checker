"use strict";

/**
 * server-checker : test/specs/plugins/smtp
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var chai = require("chai");
chai.use(require("chai-as-promised"));
var assert = chai.assert;
var async = require("async");

var serviceChecker = require("../../..");

describe("PLUGIN: smtp", function ()
{
    var good_server;
    var bad_server;
    var no_reply_server;

    before("starting up test servers", function (done)
    {
        good_server = require("net").createServer(function (socket)
        {
            socket.end("220 Good Server");
        });

        bad_server = require("net").createServer(function (socket)
        {
            socket.end("000 Bad Server");
        });

        no_reply_server = require("net").createServer(function (socket)
        {
            //Do not reply
        });

        async.parallel([
            function (callback)
            {
                good_server.listen(10000, callback);
            },
            function (callback)
            {
                bad_server.listen(10001, callback);
            },
            function (callback)
            {
                no_reply_server.listen(10002, callback);
            }
        ], done);

    });

    after("closing test servers", function ()
    {
        good_server.close();
        bad_server.close();
        no_reply_server.close();
    });

    it("should have method", function()
    {
        return assert.property(serviceChecker(), "smtp");
    });

    it("should resolve for valid server", function ()
    {
        return assert.isFulfilled(serviceChecker().smtp("localhost", 10000));
    });

    it("should reject for bad server", function ()
    {
        return assert.isRejected(serviceChecker().smtp("localhost", 10001));
    });

    it("should reject for invalid domain", function ()
    {
        return assert.isRejected(serviceChecker().smtp("invalid.domain"));
    });

    it("should reject due to timeout on slow server", function ()
    {
        return assert.isRejected(serviceChecker({timeout: 1000}).smtp("localhost", 10002));
    });

    it("should reject if host is not a string", function ()
    {
        return assert.isRejected(serviceChecker().smtp(1));
    });
});
