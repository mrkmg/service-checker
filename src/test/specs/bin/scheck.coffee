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
assert = chai.assert

scheck = require '../../../bin/scheck'

describe 'BIN: scheck', ->

  before ->
    chalk.enabled = false
    sinon.spy console, 'log'

  beforeEach ->
    console.log.reset()

  after ->
    chalk.enabled = true
    console.log.restore()

  it 'should output help correctly', ->
    args = [
      'path/to/node',
      'path/to/scheck',
      '--no-color',
      '-h'
    ]

    promise = scheck args
      .then ->
        [].concat.apply([], console.log.args).join ' '

    assert.eventually.equal promise, 'Usage:     scheck [method] host [additional_options]  Methods     http, https, smtp, smtpTls, ping, rawTcp, dns'

  it 'should process one argument correctly', ->
    args = [
      'path/to/node',
      'path/to/scheck',
      '127.0.0.1'
    ]

    promise = scheck args
      .then ->
        console.log.getCall(0).args[0]

    assert.eventually.equal promise, 'Checking 127.0.0.1 via ping.'


  it 'should process two arguments correctly', ->
    args = [
      'path/to/node',
      'path/to/scheck',
      'http',
      '127.0.0.1'
    ]

    promise = scheck args
      .then ->
        console.log.getCall(0).args[0]

    assert.eventually.equal promise, 'Checking 127.0.0.1 via http.'

  it 'should error on no arguments', ->
    args = [
      'path/to/node',
      'path/to/scheck'
    ]

    promise = scheck args
      .then ->
        console.log.getCall(0).args[0]

    assert.eventually.equal promise, 'Error: Missing host'

  it 'should error on too many arguments', ->
    args = [
      'path/to/node',
      'path/to/scheck',
      'ping',
      'host1',
      'host2'
    ]

    promise = scheck args
      .then ->
        console.log.getCall(0).args[0]

    assert.eventually.equal promise, 'Error: Too many parameters!!'

  it 'should error on unknown type', ->
    args = [
      'path/to/node',
      'path/to/scheck',
      'invalid',
      '127.0.0.1'
    ]

    promise = scheck args
      .then ->
        console.log.getCall(0).args[0]

    assert.eventually.equal promise, 'Error: invalid is not a valid method'

  it 'should error after proper amount of time', ->
    args = [
      'path/to/node',
      'path/to/scheck',
      'ping',
      '169.254.0.0',
      '--timeout',
      '1000'
    ]

    promise = scheck args
      .then ->
        parseInt console.log.getCall(1).args[0].match(/Took ([\d]+)/)[1]

    assert.eventually.closeTo promise, 1000, 100