"use strict";

/**
 * service-checker
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var _ = require("underscore");
var Promise = require("bluebird");

var errorMaps = require("./lib/utils/error-maps");

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
        checker[name] = function ()
        {
            var args = _.toArray(arguments);
            args.unshift(name);
            args.push(opts);
            return check.apply(null, args);
        }
    });

    return checker;
}

function use(plugin)
{
    if (!plugin.hasOwnProperty("name") || !_.isString(plugin.name))
        throw new Exception("plugin.name must be defined and be a string");

    if (!_.isFunction(plugin))
        throw new Exception("plugin must be a function");

    handlers[plugin.name] = plugin;
}

function check(func)
{
    var options = _.toArray(arguments).slice(1);

    return new Promise(function (resolve, reject)
    {
        handlers[func].apply(null, options)
            .then(resolve)
            .catch(errorMaps)
            .then(reject);
    });
}
