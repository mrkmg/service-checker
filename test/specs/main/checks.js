"use strict";

var chai = require("chai");
var serviceChecker = require("../../..");

chai.use(require("chai-as-promised"));
var assert = chai.assert;

describe("MAIN: checks", function ()
{
    it("check ping", function ()
    {
        assert.property(serviceChecker(), "checkPing");
        assert.isFulfilled(serviceChecker().checkPing("192.168.255.255"));
    });
});