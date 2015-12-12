###
# server-checker : test/specs/plugins/raw-tcp
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

chai = require 'chai'
chai.use require 'chai-as-promised'
async = require 'async'

ServiceChecker = require('../../../src/index') timeout: 1000

assert = chai.assert

describe 'PLUGIN: raw-tcp', ->

  server_open = require('../../fixtures/raw-tcp/server-open')()

  before 'starting up test servers', (done) ->
    async.parallel [
      (callback) ->
        server_open.start 10000, callback
    ], done

  after 'closing test servers', (done) ->
    async.parallel [
      (callback) ->
        server_open.stop callback
    ], done

  it 'should have method', ->
    assert.property ServiceChecker, 'rawTcp'

  it 'should return success:true for valid server', ->
    options = port: 10000
    assert.eventually.include ServiceChecker.rawTcp(options), success: true

  it 'should return success:false for bad server', ->
    options = port: 10001
    assert.eventually.include ServiceChecker.rawTcp(options), success: false

  describe 'disable net connect', ->
    disable_net_connect_event = require('../../fixtures/raw-tcp/disable-net-connect-event')()

    before 'disable net connect event', (done) ->
      disable_net_connect_event.start done

    after 'restore net connect event', (done) ->
      disable_net_connect_event.stop done

    it 'should return success:true on connect event timeout', ->
      options = port: 10000
      assert.eventually.include ServiceChecker.rawTcp(options), success: false

  it 'should return success:false for invalid Domain', ->
    options =
      host: 'invalid.domain'
      port: 10000
    assert.eventually.include ServiceChecker.rawTcp(options), success: false

  it 'should reject for no port', ->
    options = {}
    assert.isRejected ServiceChecker.rawTcp(options)
