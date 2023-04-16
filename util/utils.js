const fs = require("fs");
const ejs = require("ejs");

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

const getCommonOptions = (data) => {
    const footerTemplate = fs.readFileSync(
        "./ejs_pdf_templates/footer.ejs",
        "utf-8"
      );

      const generateFooter = ejs.render(footerTemplate, data)

      return {
        orientation: "portrait",
        printBackground: true,
        format: "A4",
        displayHeaderFooter: true,
        footerTemplate: generateFooter,
        childProcessOptions : {
            env: {
              OPENSSL_CONF: '/dev/null',
            },
          }
      };
}

module.exports = {
    getLoggerInfoText,
    getCommonOptions
}