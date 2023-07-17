const fs = require('fs');
const { ejsRender } = require('../util/templateEngine');
const { getCommonOptions } = require('../util/utils');
const { ejsPuppeteerPdfGenerator } = require('../pdf_generators/PdfGenerator');
const ejsUtils = require('../util/ejsUtils');
const { getFormatDate } = require('../util/dateTimeFormattor');
const { numberWithCommas } = require('../util/amountToWordUtil');

class SampleExportPermit {
  constructor() { };

  handleAmountThousandsSeparator(formValue) {
    formValue.productDetails.map((productInfo, idx) => {
      formValue.productDetails[idx]["sampleValue"] = numberWithCommas(productInfo["sampleValue"]);
    })
  }

  async generate(body) {
    // CHANGE DATE FORMATE
    body.formValue.invoiceDate = body?.formValue?.invoiceDate !== "N/A" ? getFormatDate(body?.formValue?.invoiceDate) : body?.formValue?.invoiceDate;
    body.formValue.issueDate = body?.formValue?.issueDate !== "N/A" ? getFormatDate(body?.formValue?.issueDate) : body?.formValue?.issueDate;
    body.formValue.expiredDate = body?.formValue?.expiredDate !== "N/A" ? getFormatDate(body?.formValue?.expiredDate) : body?.formValue?.expiredDate;

    this.handleAmountThousandsSeparator(body.formValue)

    body.formValue.utils = ejsUtils;

    const initialTemplate = fs.readFileSync('./ejs_pdf_templates/sample-export-permit/sample-export-permit.ejs', 'utf8');
    const initialHeaderTemplate = fs.readFileSync('./ejs_pdf_templates/sample-export-permit/header-template.ejs', 'utf8');

    const headerTemplate = ejsRender(initialHeaderTemplate, body);
    const generateTemplate = ejsRender(initialTemplate, body);

    const options = {
      ...getCommonOptions(body),
      headerTemplate,
    };

    const pageStyle = `
            @page {
                margin-top: 150px;
                margin-bottom: 180px;
            }
        `;

    const generatedPdf = ejsPuppeteerPdfGenerator(generateTemplate, options, pageStyle);

    return generatedPdf;
  }
};

module.exports = SampleExportPermit;