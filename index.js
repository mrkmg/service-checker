module.exports = require("./service-checker");

module.exports.use(require("./lib/checkers/ping"));
module.exports.use(require("./lib/checkers/http"));
module.exports.use(require("./lib/checkers/https"));
module.exports.use(require("./lib/checkers/smtp"));