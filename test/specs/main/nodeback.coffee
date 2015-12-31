###
# server-checker : test/specs/main/nodeback
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

chai = require('chai')
chai.use require('chai-as-promised')
assert = chai.assert

ServiceChecker = require('../../../src/index') timeout: 1000
CheckResult = require '../../../src/lib/components/CheckResult'

describe 'MAIN: nodeback interface', ->
  it 'should eventually call nodeback with CheckResult with valid data', (done) ->
    options =
      host: '127.0.0.1'

    ServiceChecker.ping options, (err, result) ->
      assert.instanceOf result, CheckResult
      done()

  it 'should eventually call nodeback with err on bad data', (done) ->
    options =
      host: false

    ServiceChecker.ping options, (err, result) ->
      assert.instanceOf err, Error
      done()

