var serviceChecker = require('./lib/service-checker');
var http = require('./lib/plugins/http');
var smtp = require('./lib/plugins/smtp');
var ping = require('./lib/plugins/ping');
var rawTcp = require('./lib/plugins/raw-tcp');

module.exports = function(options) {
  var instance;
  instance = serviceChecker(options);
  instance.use(http);
  instance.use(smtp);
  instance.use(ping);
  instance.use(rawTcp);
  return instance;
};
