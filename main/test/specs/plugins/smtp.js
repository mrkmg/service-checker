// Generated by CoffeeScript 1.10.0

/*
 * server-checker : test/specs/plugins/smtp
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

(function() {
  var assert, async, chai, serviceChecker;

  chai = require('chai');

  chai.use(require('chai-as-promised'));

  assert = chai.assert;

  async = require('async');

  serviceChecker = require('../../..')({
    timeout: 1000
  });

  describe('PLUGIN: smtp', function() {
    var server_error, server_timeout, server_valid;
    server_valid = require('../../fixtures/smtp/server-valid')();
    server_error = require('../../fixtures/smtp/server-error')();
    server_timeout = require('../../fixtures/smtp/server-timeout')();
    before('starting up test servers', function(done) {
      return async.parallel([
        function(callback) {
          return server_valid.start(10000, callback);
        }, function(callback) {
          return server_error.start(10001, callback);
        }, function(callback) {
          return server_timeout.start(10002, callback);
        }
      ], done);
    });
    after('closing test servers', function(done) {
      return async.parallel([
        function(callback) {
          return server_valid.stop(callback);
        }, function(callback) {
          return server_error.stop(callback);
        }, function(callback) {
          return server_timeout.stop(callback);
        }
      ], done);
    });
    it('should have method', function() {
      return assert.property(serviceChecker, 'smtp');
    });
    it('should return success:true for valid server', function() {
      var options;
      options = {
        host: 'localhost',
        port: 10000
      };
      return assert.eventually.include(serviceChecker.smtp(options), {
        success: true
      });
    });
    it('should return success:false for bad server', function() {
      var options;
      options = {
        port: 10001
      };
      return assert.eventually.include(serviceChecker.smtp(options), {
        success: false
      });
    });
    it('should return success:false due to timeout on slow server', function() {
      var options;
      options = {
        port: 10002
      };
      return assert.eventually.include(serviceChecker.smtp(options), {
        success: false
      });
    });
    it('should reject if bad host parameter passed', function() {
      var options;
      options = {
        host: true
      };
      return assert.isRejected(serviceChecker.smtp(options));
    });
    return it('should reject if bad port parameter passed', function() {
      var options;
      options = {
        port: true
      };
      return assert.isRejected(serviceChecker.smtp(options));
    });
  });

}).call(this);