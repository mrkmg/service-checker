// Generated by CoffeeScript 1.10.0

/*
 * server-checker : test/specs/main/init
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

(function() {
  var assert, chai, serviceChecker, serviceCheckerNonInit;

  chai = require('chai');

  chai.use(require('chai-as-promised'));

  assert = chai.assert;

  serviceChecker = require('../../..')();

  serviceCheckerNonInit = require('../../..');

  describe('MAIN: Module Exists', function() {
    it("_name should exist and equal 'service-checker'", function() {
      return assert.equal(serviceChecker._name, 'service-checker');
    });
    it('should throw for bad default initialization', function() {
      return assert.throws(function() {
        return serviceCheckerNonInit({
          nonprop: 'someValue'
        });
      });
    });
    it('should throw for bad default timeout', function() {
      return assert.throws(function() {
        return serviceCheckerNonInit({
          timeout: 'a'
        });
      });
    });
    return it('should throw for a bad ca', function() {
      return assert.throws(function() {
        return serviceCheckerNonInit({
          ca: true
        });
      });
    });
  });

}).call(this);