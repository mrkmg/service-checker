###
# service-checker
# Author: MrKMG (https://github.com/mrkmg)
# Inspired from https://github.com/stevenzeiler/promise-while/blob/75e6aefc9c891012cac7cb76a1b3f04f699ca3d7/index.js
# Lots of input from #node.js on FreeNode
#
# MIT License
###

PromiseWhile = (Promise) ->
  While = (condition, action) ->
    Promise
      .resolve()
      .then action
      .then condition
      .then (do_another) ->
        if do_another
          While(condition, action)

module.exports = PromiseWhile
