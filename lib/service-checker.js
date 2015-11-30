"use strict";

/**
 * service-checker
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var _ = require("underscore");
var Promise = require("bluebird");
var checkResult = require("./check-result");

module.exports = serviceChecker;
module.exports.use = use;

var handlers = {};

function serviceChecker(opts)
{
    if (!_.isObject(opts)) opts = {};

    _.defaults(opts, {
        timeout: 5000
    });

    var checker = {};

    checker._name = "service-checker";
    checker._loaded = [];

    _.each(handlers, function (handler, name)
    {
        checker._loaded.push(name);
        checker[name] = function (options)
        {
            var result;
            return Promise
                .try(function ()
                {
                    result = new checkResult(name);
                    _.defaults(options, opts);
                    return options;
                })
                .then(function (options)
                {
                    return Promise.try(function ()
                    {
                        return handler(options);
                    });
                })
                .then(function (error)
                {
                    return result.finished(error);
                });

        }
    });

    return checker;
}

function use(plugin)
{
    if (!_.isFunction(plugin))
    {
        throw new Error("plugin must be a function");
    }

    if (!plugin.hasOwnProperty("name") || !_.isString(plugin.name) || _.isEmpty(plugin.name))
    {
        throw new Error("plugin.name must be defined and be a string");
    }

    handlers[plugin.name] = plugin;

    return this;
}
