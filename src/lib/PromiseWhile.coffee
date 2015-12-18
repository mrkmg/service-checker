###
# service-checker
# Author: MrKMG (https://github.com/mrkmg)
# Inspired from https://github.com/stevenzeiler/promise-while/blob/75e6aefc9c891012cac7cb76a1b3f04f699ca3d7/index.js
#
# MIT License
###

PromiseWhile = (Promise) ->
  (condition, action) ->
    new Promise (resolve, reject) ->
      last_result = undefined

      whileLoop = ->
        Promise
          .try ->
            action last_result
          .then (action_result) ->
            last_result = action_result
          .then condition
          .then (test_result) ->
            if test_result
              whileLoop()
            else
              resolve last_result
          .catch reject

      whileLoop()

module.exports = PromiseWhile
