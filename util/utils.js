const fs = require("fs");
const ejs = require("ejs");
const { SOP_CODE } = require("../constants/const");

const getLoggerInfoText = (reqBody) => {
    if (typeof reqBody === "object") {
        let loggerText = "For";

        Object.keys(reqBody).map(key => {
            loggerText += ` ${key} = ${reqBody[key]} `
        })

        return loggerText;
    }
    return "";
}

const getFooterTemplate = (sopCode) => {
    let template = fs.readFileSync(
        "./ejs_pdf_templates/footer.ejs",
        "utf-8"
    );
    if (
        sopCode === SOP_CODE.importPermit || 
        sopCode === SOP_CODE.exportPermit ||
        sopCode === SOP_CODE.sampleImportPermit ||
        sopCode === SOP_CODE.sampleExportPermit ||
        sopCode === SOP_CODE.localSalesPermit ||
        sopCode === SOP_CODE.localPurchasePermit
        ) {
        template = fs.readFileSync(
            "./ejs_pdf_templates/footer-with-caution.ejs",
            "utf-8"
        );
    }

    return template;
}

const getCommonOptions = (data) => {
    const footerTemplate = getFooterTemplate(data.sopCode);

    const generateFooter = ejs.render(footerTemplate, data)

    return {
        orientation: "portrait",
        printBackground: true,
        format: "A4",
        displayHeaderFooter: true,
        footerTemplate: generateFooter,
        childProcessOptions: {
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