"use strict";

/**
 * server-checker : test/specs/plugins/http
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var chai = require("chai");
chai.use(require("chai-as-promised"));
var assert = chai.assert;
var async = require("async");

var serviceChecker = require("../../..");

describe("PLUGIN: http", function ()
{
    var good_server;
    var bad_server;

    before("starting up test servers", function (done)
    {
        good_server = require("http").createServer(function (request, response)
        {
            response.writeHead(200, {"Content-Type": "text/plain"});
            response.end("Good");
        });

        bad_server = require("http").createServer(function (request, response)
        {
            response.writeHead(404);
            response.end("Bad");
        });

        async.parallel([
            function (callback)
            {
                good_server.listen(10000, callback);
            },
            function (callback)
            {
                bad_server.listen(10001, callback);
            }
        ], done);

    });

    after("closing test servers", function ()
    {
        good_server.close();
        bad_server.close();
    });

    it("should have method", function ()
    {
        return assert.property(serviceChecker(), "http");
    });

    it("should resolve for valid Domain", function ()
    {
        return assert.isFulfilled(serviceChecker().http("localhost", 10000));
    });

    it("should reject for 404 error", function ()
    {
        return assert.isRejected(serviceChecker().http("localhost", 10001));
    });

    it("should reject for invalid Domain", function ()
    {
        return assert.isRejected(serviceChecker().http("invalid.domain"));
    });
});