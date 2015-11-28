module.exports = require("./lib/service-checker");

module.exports.use(require("./lib/checkers/ping"));
module.exports.use(require("./lib/checkers/http"));
module.exports.use(require("./lib/checkers/https"));
module.exports.use(require("./lib/checkers/smtp"));
module.exports.use(require("./lib/checkers/raw-tcp"));
