const fs = require('fs');
const { ejsRender } = require('../util/templateEngine');
const { getCommonOptions } = require('../util/utils');
const { ejsPuppeteerPdfGenerator } = require('../pdf_generators/PdfGenerator');
const ejsUtils = require('../util/ejsUtils');
const { CARRIER_TYPE } = require('../constants/const');
const { changeDateFormat } = require('../util/dateTimeFormattor');
const { numberWithCommas } = require('../util/amountToWordUtil');
const logger = require('../util/logger');

class ImportPermit {
    constructor() { };

    handleDateTimeFormat(formValue) {
        //DATE TIME FORMAT: 13 August 2022
        changeDateFormat(formValue, "applicationDate");
      }
    
      handleAmountThousandsSeparator(formValue) {
        logger.info("Start converting normal to thousands separator for sop: %s", formValue.sopCode)
        formValue["dCostOfTheProjectInUs"] = numberWithCommas(
          formValue["dCostOfTheProjectInUs"]
        );
    
        logger.info("Converting done")
      }

    async generate(body) {
        this.handleDateTimeFormat(body.formValue);
    this.handleAmountThousandsSeparator(body.formValue)

    body.formValue.industryCategory =
    body.formValue?.industryCategory.name || "";

        body.formValue.utils = ejsUtils;

        const initialTemplate = fs.readFileSync('./ejs_pdf_templates/project-registration/project-registration.ejs', 'utf8');
        const initialHeaderTemplate = fs.readFileSync('./ejs_pdf_templates/project-registration/header-template.ejs', 'utf8');

        const headerTemplate = ejsRender(initialHeaderTemplate, body);
        const generateTemplate = ejsRender(initialTemplate, body);

        const options = {
            ...getCommonOptions(body),
            headerTemplate,
        };

        const pageStyle = `
            @page {
                margin-top: 150px;
                margin-bottom: 40px;
            }
        `;

        const generatedPdf = ejsPuppeteerPdfGenerator(generateTemplate, options, pageStyle);

        return generatedPdf;
    }
};

module.exports = ImportPermit;