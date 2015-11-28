module.exports = require("./lib/service-checker");

module.exports.use(require("./lib/plugins/ping"));
module.exports.use(require("./lib/plugins/http"));
module.exports.use(require("./lib/plugins/https"));
module.exports.use(require("./lib/plugins/smtp"));
module.exports.use(require("./lib/plugins/raw-tcp"));
