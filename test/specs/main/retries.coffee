###
# server-checker : test/specs/main/retries
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

chai = require 'chai'
chai.use(require 'chai-as-promised')
assert = chai.assert

ServiceChecker = require('../../../src/index') timeout: 1000

describe 'MAIN: Retries', ->
  it 'should try 3 times on failure', ->
    tries = 0

    errorCounter = ->
      ++tries

    ServiceChecker.use
      errorCounter: errorCounter

    assert.eventually.equal ServiceChecker.errorCounter({retries: 2}).then( -> tries ), 3
