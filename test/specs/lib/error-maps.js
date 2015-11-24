var expect = require("chai").expect;
var errorMaps = require("../../../lib/error-maps");

describe("Check Error Maps", function ()
{

    it("Should have a parseError method", function ()
    {
        expect(errorMaps).to.have.property("parseError");
        expect(errorMaps.parseError).to.be.a("function");
    });
});