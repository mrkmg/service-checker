"use strict";

var chai = require("chai");
var serviceChecker = require("../../..");

chai.use(require("chai-as-promised"));
var assert = chai.assert;

describe("MAIN: Module Exists", function ()
{
    it("_name should exist and equal 'service-checker'", function ()
    {
        assert.equal(serviceChecker()._name, "service-checker");
    });
});