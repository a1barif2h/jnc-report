const { getConvertedCurrencyValue } = require("../services/gateway_services/bezaServiceGateway");

const currencyConverter =  async (currencyList, target) => {
    const currencyKeys = Object.keys(currencyList);
    const convertedValue =  await Promise.all(currencyKeys.map(async (currency) => await getConvertedCurrencyValue(currencyList[currency], currency, target)))
    console.log("convertedValue ==>", convertedValue);
    return convertedValue.reduce( (sum, val) => sum + val, 0);
}

module.exports = currencyConverter;