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

    it("should pass arguments in correct place", function (done)
    {
        var check_timeout = 0;
        var check_param1 = 0;
        var check_param2 = 0;
        var check_param3 = 0;
        function plugin_test_3(param1, param2, param3, options)
        {
            check_param1 = param1;
            check_param2 = param2;
            check_param3 = param3;
            check_timeout = options.timeout;
            return require("bluebird").resolve();
        }

        serviceChecker.use(plugin_test_3);

        serviceChecker({timeout: 1000}).plugin_test_3("a", "b", "c").then(function ()
        {
            assert.equal(check_param1, "a");
            assert.equal(check_param2, "b");
            assert.equal(check_param3, "c");
            assert.equal(check_timeout, 1000);
            done();
        }).catch(done);
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
