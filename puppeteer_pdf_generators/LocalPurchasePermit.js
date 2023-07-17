const fs = require('fs');
const { ejsRender } = require('../util/templateEngine');
const { getCommonOptions } = require('../util/utils');
const { ejsPuppeteerPdfGenerator } = require('../pdf_generators/PdfGenerator');
const ejsUtils = require('../util/ejsUtils');
const { getFormatDate, changeDateFormat } = require('../util/dateTimeFormattor');
const { numberWithCommas } = require('../util/amountToWordUtil');

class LocalPurchasePermit {
  constructor() { };

  handleDateTimeFormat(formValue) {
    //DATE TIME FORMAT: 13 August 2022
    changeDateFormat(formValue, "undertakingDate");
    changeDateFormat(formValue, "invoiceDate");
  }

  handleAmountThousandsSeparator(formValue) {
    formValue["hiddenUnitPrice"] = numberWithCommas(formValue["hiddenUnitPrice"]);
    formValue.PurchaseDetailsGroup.map((purchaseDetail, idx) => {
      formValue.PurchaseDetailsGroup[idx]["fobCurrencyValue"] = numberWithCommas(purchaseDetail["fobCurrencyValue"]);
    })
  }

  async generate(body) {
    this.handleDateTimeFormat(body.formValue)
    this.handleAmountThousandsSeparator(body.formValue)

    body.formValue.utils = ejsUtils;

    const initialTemplate = fs.readFileSync('./ejs_pdf_templates/local-purchase-permit/local-purchase-permit.ejs', 'utf8');
    const initialHeaderTemplate = fs.readFileSync('./ejs_pdf_templates/local-purchase-permit/header-template.ejs', 'utf8');

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

module.exports = LocalPurchasePermit;