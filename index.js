module.exports = require("./lib/service-checker");

var http = require("./lib/plugins/http");
var smtp = require("./lib/plugins/smtp");
var ping = require("./lib/plugins/ping");
var rawTcp = require("./lib/plugins/raw-tcp");

module.exports.use(ping);
module.exports.use(http.http);
module.exports.use(http.https);
module.exports.use(smtp.smtp);
module.exports.use(smtp.smtpTls);
module.exports.use(rawTcp);
