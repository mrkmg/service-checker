###
# server-checker : test/specs/bin/scheck
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

chai = require 'chai'
chai.use(require 'chai-as-promised')
sinon = require 'sinon'
chalk = require 'chalk'
Promise = require 'bluebird'
assert = chai.assert

server_200 = require('../../fixtures/http/server-200')()
scheck = require '../../../src/bin/scheck'

describe 'BIN: scheck', ->

  before (done) ->
    sinon.stub process, 'exit'
    sinon.spy console, 'log'
    chalk.enabled = false
    server_200.start 10000, done

  beforeEach ->
    process.exit.reset()
    console.log.reset()

  after (done) ->
    process.exit.restore()
    console.log.restore()
    chalk.enabled = true
    server_200.stop done

  it 'should output help correctly', ->
    args = [
      'path/to/node'
      'path/to/scheck'
      '--no-color'
      '-h'
    ]

    promise = scheck args
      .then ->
        [].concat.apply([], console.log.args).join ' '

    assert.eventually.equal promise, 'Usage:     scheck [method] host [additional_options]  Methods     http, https, smtp, smtpTls, ping, rawTcp, dns'

  it 'should exit correctly for help', ->
    args = [
      'path/to/node'
      'path/to/scheck'
      '--no-color'
      '-h'
    ]

    promise = scheck args
    .then ->
      process.exit.getCall(0).args[0]

    assert.eventually.equal promise, 0

  it 'should process one argument correctly', ->
    args = [
      'path/to/node'
      'path/to/scheck'
      '127.0.0.1'
    ]

    promise = scheck args
      .then ->
        console.log.getCall(0).args[0]

    assert.eventually.equal promise, 'Checking 127.0.0.1 via ping'

  it 'should exit 0 for successful check', ->
    args = [
      'path/to/node'
      'path/to/scheck'
      '127.0.0.1'
    ]

    promise = scheck args
    .then ->
      process.exit.getCall(0).args[0]

    assert.eventually.equal promise, 0


  it 'should process two arguments correctly', ->
    args = [
      'path/to/node'
      'path/to/scheck'
      'http'
      '127.0.0.1'
      '--port 10000'
    ]

    promise = scheck args
      .then ->
        console.log.getCall(0).args[0]

    assert.eventually.equal promise, 'Checking 127.0.0.1 via http'

  it 'should error on no arguments', ->
    args = [
      'path/to/node'
      'path/to/scheck'
    ]

    promise = scheck args
      .then ->
        console.log.getCall(0).args[0]

    assert.eventually.equal promise, 'Error: Missing host'

  it 'should exit 1 for invalid invocation', ->
    args = [
      'path/to/node'
      'path/to/scheck'
    ]

    promise = scheck args
    .then ->
      process.exit.getCall(0).args[0]

    assert.eventually.equal promise, 1

  it 'should error on too many arguments', ->
    args = [
      'path/to/node'
      'path/to/scheck'
      'ping'
      'host1'
      'host2'
    ]

    promise = scheck args
      .then ->
        console.log.getCall(0).args[0]

    assert.eventually.equal promise, 'Error: Too many parameters'

  it 'should error on unknown type', ->
    args = [
      'path/to/node'
      'path/to/scheck'
      'invalid'
      '127.0.0.1'
    ]

    promise = scheck args
      .then ->
        console.log.getCall(0).args[0]

    assert.eventually.equal promise, 'Error: invalid is not a valid method'

  it 'should error after proper amount of time', ->
    args = [
      'path/to/node'
      'path/to/scheck'
      'ping'
      '169.254.0.0'
      '--timeout'
      '1000'
    ]

    promise = scheck args
      .then ->
        parseInt console.log.getCall(2).args[0].match(/([\d]+)/)[1]

    assert.eventually.closeTo promise, 1000, 100

  it 'should exit 2 for unsuccessful check', ->
    args = [
      'path/to/node'
      'path/to/scheck'
      'ping'
      '169.254.0.0'
      '--timeout'
      '1000'
    ]

    promise = scheck args
    .then ->
      process.exit.getCall(0).args[0]

    assert.eventually.equal promise, 2

  it 'should output correctly with simple mode for successful check', ->
    args = [
      'path/to/node'
      'path/to/scheck'
      '127.0.0.1'
      '-s'
    ]

    promise = scheck args
      .then ->
        console.log.getCall(0).args[0]

    assert.eventually.match promise, /Up\t[\d]+/

  it 'should output correctly with simple mode for unsuccessful check', ->
    args = [
      'path/to/node'
      'path/to/scheck'
      '169.254.0.0'
      '-s'
      '--timeout'
      '1000'
    ]

    promise = scheck args
    .then ->
      console.log.getCall(0).args[0]

    assert.eventually.match promise, /Down\t[\d]+/
