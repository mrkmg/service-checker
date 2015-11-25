"use strict";

/**
 * server-checker : test/specs/lib/error-maps
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var chai = require("chai");
var errorMaps = require("../../../lib/utils/error-maps");

chai.use(require("chai-as-promised"));
var assert = chai.assert;

describe("LIB: error-maps", function ()
{
    it("should be a function", function ()
    {
        return assert.isFunction(errorMaps);
    });

    //TODO - Figure out how to better test this
});