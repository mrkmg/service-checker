###
# server-checker : test/fixtures/raw-tcp/disable-net-connect-event
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

_ = require 'underscore'
net = require 'net'

module.exports = ->
  original_net_on = net.Socket::on

  start: (callback) ->
    net.Socket::on = (event) ->
      if event == 'connect'
        return this
      original_net_on.apply this, _.toArray(arguments)
    callback()
  stop: (callback) ->
    net.Socket::on = original_net_on
    callback()
