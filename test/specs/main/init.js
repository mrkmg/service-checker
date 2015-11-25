"use strict";

/**
 * server-checker : test/specs/main/init
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var chai = require("chai");
chai.use(require("chai-as-promised"));
var assert = chai.assert;

var serviceChecker = require("../../..");

describe("MAIN: Module Exists", function ()
{
    it("_name should exist and equal 'service-checker'", function ()
    {
        return assert.equal(serviceChecker()._name, "service-checker");
    });
});
