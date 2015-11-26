"use strict";

/**
 * server-checker : test/specs/main/plugin
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var chai = require("chai");
chai.use(require("chai-as-promised"));
var assert = chai.assert;

var serviceChecker = require("../../..");

describe("MAIN: plugin system", function ()
{
    it("should have a use function", function ()
    {
        assert.property(serviceChecker, "use");
        assert.isFunction(serviceChecker.use);
    });

    it("should be able to register a plugin", function ()
    {
        serviceChecker.use(function plugin_test_1()
        {
            return require("bluebird").resolve(true);
        });

        assert.include(serviceChecker()._loaded, "plugin_test_1");
        assert.property(serviceChecker(), "plugin_test_1");
        assert.isFunction(serviceChecker().plugin_test_1);
    });

    it("should be able to use a registered plugin", function ()
    {
        function plugin_test_2()
        {
            return require("bluebird").resolve(true);
        }

        serviceChecker.use(plugin_test_2);

        return assert.isFulfilled(serviceChecker().plugin_test_2());
    });

    it("should pass options object is correct place", function ()
    {
        function plugin_test_3(param1, param2, param3, options)
        {
            return require("bluebird").resolve(options.timeout);
        }

        serviceChecker.use(plugin_test_3);

        return assert.eventually.equal(serviceChecker({timeout: 1000}).plugin_test_3(), 1000);
    });

    it("should throw an error if non function passed to use", function ()
    {
        return assert.throws(function ()
        {
            serviceChecker.use(true)
        });
    });

    it("should throw if function is not named", function ()
    {
        return assert.throws(function ()
        {
            serviceChecker.use(function ()
            {
                return true;
            });
        });
    })
});
