"use strict";

var chai = require("chai");
chai.use(require("chai-as-promised"));
var assert = chai.assert;

var serviceChecker = require("../../..");

describe("MAIN: Module Exists", function ()
{
    it("_name should exist and equal 'service-checker'", function ()
    {
        assert.equal(serviceChecker()._name, "service-checker");
    });
});
