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
            var needed_args = handler.length - 1;
            var args = _.toArray(arguments);

            while (args.length < needed_args)
                args.push(null);

            args.push(opts);
            args.unshift(name);

            return check.apply(null, args);
        }
    });

    return checker;
}

function use(plugin)
{
    if (!_.isFunction(plugin))
        throw new Error("plugin must be a function");

    if (!plugin.hasOwnProperty("name") || !_.isString(plugin.name) || _.isEmpty(plugin.name))
        throw new Error("plugin.name must be defined and be a string");

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
