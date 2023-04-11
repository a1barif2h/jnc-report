const getLoggerInfoText = (reqBody) => {
    if(typeof reqBody === "object") {
        let loggerText = "For";

        Object.keys(reqBody).map(key => {
            loggerText += ` ${key} = ${reqBody[key]} `
        })

        return loggerText;
    }
    return "";
}

module.exports = {
    getLoggerInfoText
}