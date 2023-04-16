
const { ProjectClearance, TradeLicense, TradeLicenseRenew, TechnicalKnowHowFee, RoyaltyFee } = require("../puppeteer_pdf_generators");
const { AllSopsCodes } = require("../shared/constants/AllSopsCodes");
const logger = require("../util/logger");

const generate = async (data) => {
    let sopCode = data.sopCode;
    let generatedPdf = null;

    switch (sopCode) {
        case AllSopsCodes.PROJECT_CLEARANCE.value:
            const projectClearance = new ProjectClearance();
            logger.info(`Generating ejs and puppeteer pdf for ${AllSopsCodes.PROJECT_CLEARANCE.value}`);
            generatedPdf = await projectClearance.generate(data);
            break;
        
        case AllSopsCodes.TRADE_LICENSE.value:
            const tradeLicense = new TradeLicense();
            logger.info(`Generating ejs and puppeteer pdf for ${AllSopsCodes.TRADE_LICENSE.value}`);
            generatedPdf = await tradeLicense.generate(data);
            break;

        case AllSopsCodes.TRADE_LICENSE_RENEW.value:
            const tradeLicenseRenew = new TradeLicenseRenew();
            logger.info(`Generating ejs and puppeteer pdf for ${AllSopsCodes.TRADE_LICENSE_RENEW.value}`);
            generatedPdf = await tradeLicenseRenew.generate(data);
            break;

        case AllSopsCodes.TECHNICAL_KNOW_HOW_FEE.value:
            const technicalKnowHowFee = new TechnicalKnowHowFee();
            logger.info(`Generating ejs and puppeteer pdf for ${AllSopsCodes.TECHNICAL_KNOW_HOW_FEE.value}`);
            generatedPdf = await technicalKnowHowFee.generate(data);
            break;

        case AllSopsCodes.ROYALTY_FEE.value:
            const royaltyFee = new RoyaltyFee();
            logger.info(`Generating ejs and puppeteer pdf for ${AllSopsCodes.ROYALTY_FEE.value}`);
            generatedPdf = await royaltyFee.generate(data);
            break;
            
        default:
            break;
    }

    return generatedPdf;
}

module.exports = {
    generate,
}