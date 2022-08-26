const { format, createLogger, transports } = require('winston');
const { timestamp, combine, errors, json, splat } = format;

function buildProdLogger() {
  return createLogger({
    format: combine(timestamp(), errors({ stack: true }),splat(), json()),
    defaultMeta: { service: 'beza-certificate-service' },
    transports: [new transports.Console()],
  });
}

module.exports = buildProdLogger;
