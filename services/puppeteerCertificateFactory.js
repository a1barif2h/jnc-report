const ProjectClearance = require("../puppeteer_pdf_generators/ProjectClearance");
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
        default:
            break;
    }

    return generatedPdf;
}

module.exports = {
    generate,
}