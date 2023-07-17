const fs = require('fs');

const { ejsPuppeteerPdfGenerator } = require('../pdf_generators/PdfGenerator');
const { numberWithCommas } = require('../util/amountToWordUtil');
const { changeDateFormat } = require('../util/dateTimeFormattor');
const ejsUtils = require('../util/ejsUtils');
const { ejsRender } = require('../util/templateEngine');
const { getCommonOptions } = require('../util/utils');

class RoyaltyFee {
    constructor() { };

    handleDateTimeFormat(formValue) {
        //DATE TIME FORMAT: 13 August 2022
        changeDateFormat(formValue, "date");
        changeDateFormat(formValue, "applicationDate");
    }

    handleAmountThousandsSeparator(formValue) {
        formValue["currencyValue"] = numberWithCommas(formValue["currencyValue"]);
        formValue["importCostOfMachineryOfTheLastYear"] = numberWithCommas(formValue["importCostOfMachineryOfTheLastYear"]);
    }

    async generate(body) {
        this.handleDateTimeFormat(body.formValue)
        this.handleAmountThousandsSeparator(body.formValue)
        body.formValue.utils = ejsUtils;

        const initialTemplate = fs.readFileSync(
            "./ejs_pdf_templates/royalty-fee/royalty-fee.ejs",
            "utf-8"
        );
        const initialHeaderTemplate = fs.readFileSync('./ejs_pdf_templates/royalty-fee/header-template.ejs', 'utf-8')

        const pageStyle = `
          @page {
            margin-top: 110px;
            margin-bottom: 40px;
          }
        `;

        const generateTemplate = ejsRender(initialTemplate, body);
        const generateHeaderTemplate = ejsRender(initialHeaderTemplate, body);

        const options = {
            ...getCommonOptions(body),
            headerTemplate: generateHeaderTemplate,
        };

        const generatedPdf = ejsPuppeteerPdfGenerator(
            generateTemplate,
            options,
            pageStyle
        );

        return generatedPdf;
    }

}

module.exports = RoyaltyFee;