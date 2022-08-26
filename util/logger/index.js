const buildDevLogger = require("./dev-logger");
const buildProdLogger = require("./prod-logger");

let logger = null;
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'staging') {
    logger = buildDevLogger();
} 
else {
    logger = buildDevLogger();
}

module.exports = logger;
