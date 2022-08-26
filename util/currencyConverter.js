const { getConvertedCurrencyValue } = require("../services/gateway_services/bezaServiceGateway");
const logger = require("./logger");

const currencyConverter =  async (currencyList, target) => {
    const currencyKeys = Object.keys(currencyList);
    const convertedValue =  await Promise.all(currencyKeys.map(async (currency) => await getConvertedCurrencyValue(currencyList[currency], currency, target)))
    logger.info(`converted value: ${convertedValue}`)
    return convertedValue.reduce( (sum, val) => sum + val, 0);
}

module.exports = currencyConverter;