// Generated by CoffeeScript 1.10.0

/*
 * service-checker
 * Author: MrKMG (https://github.com/mrkmg)
 * Inspired from https://github.com/stevenzeiler/promise-while/blob/75e6aefc9c891012cac7cb76a1b3f04f699ca3d7/index.js
 * Lots of input from #node.js on FreeNode
 *
 * MIT License
 */

(function() {
  var PromiseWhile;

  PromiseWhile = function(Promise) {
    var While;
    return While = function(condition, action) {
      return Promise.resolve().then(action).then(condition).then(function(do_another) {
        if (do_another) {
          return While(condition, action);
        }
      });
    };
  };

  module.exports = PromiseWhile;

}).call(this);