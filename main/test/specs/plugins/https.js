// Generated by CoffeeScript 1.10.0

/*
 * server-checker : test/specs/plugins/https
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

(function() {
  var assert, async, chai, fs, serviceChecker;

  fs = require('fs');

  chai = require('chai');

  chai.use(require('chai-as-promised'));

  assert = chai.assert;

  async = require('async');

  serviceChecker = require('../../..')({
    timeout: 1000
  });

  describe('PLUGIN: https', function() {
    var expired_cert, server_expired, server_valid_200, server_valid_404, server_valid_timeout, valid_cert;
    server_valid_200 = require('../../fixtures/https/server-valid-200')();
    server_valid_404 = require('../../fixtures/https/server-valid-404')();
    server_valid_timeout = require('../../fixtures/https/server-valid-timeout')();
    server_expired = require('../../fixtures/https/server-expired')();
    valid_cert = fs.readFileSync('main/test/fixtures/https/certs/valid.cert');
    expired_cert = fs.readFileSync('main/test/fixtures/https/certs/expired.cert');
    before('starting up test servers', function(done) {
      return async.parallel([
        function(callback) {
          return server_valid_200.start(10000, callback);
        }, function(callback) {
          return server_valid_404.start(10001, callback);
        }, function(callback) {
          return server_valid_timeout.start(10002, callback);
        }, function(callback) {
          return server_expired.start(10003, callback);
        }
      ], done);
    });
    after('closing test servers', function(done) {
      return async.parallel([
        function(callback) {
          return server_valid_200.stop(callback);
        }, function(callback) {
          return server_valid_404.stop(callback);
        }, function(callback) {
          return server_valid_timeout.stop(callback);
        }, function(callback) {
          return server_expired.stop(callback);
        }
      ], done);
    });
    it('should have method', function() {
      return assert.property(serviceChecker, 'https');
    });
    it('should return success:true for good host', function() {
      var options;
      options = {
        port: 10000,
        ca: valid_cert
      };
      return assert.eventually.include(serviceChecker.https(options), {
        success: true
      });
    });
    it('should return success:false for self signed cert', function() {
      var options;
      options = {
        port: 10000
      };
      return assert.eventually.include(serviceChecker.https(options), {
        success: false
      });
    });
    it('should return success:false for 404 response', function() {
      var options;
      options = {
        port: 10001,
        ca: valid_cert
      };
      return assert.eventually.include(serviceChecker.https(options), {
        success: false
      });
    });
    it('should return success:false for slow responding server', function() {
      var options;
      options = {
        port: 10002,
        ca: valid_cert
      };
      return assert.eventually.include(serviceChecker.https(options), {
        success: false
      });
    });
    it('should return success:false for expired ssl cert', function() {
      var options;
      options = {
        port: 10003,
        ca: expired_cert
      };
      return assert.eventually.include(serviceChecker.https(options), {
        success: false
      });
    });
    it('should return success:false for invalid Domain', function() {
      var options;
      options = {
        host: 'invalid.domain'
      };
      return assert.eventually.include(serviceChecker.https(options), {
        success: false
      });
    });
    return it('should reject if bad parameter passed', function() {
      var options;
      options = {
        host: true
      };
      return assert.isRejected(serviceChecker.https(options));
    });
  });

}).call(this);
