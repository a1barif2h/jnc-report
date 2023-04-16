const fs = require('fs');

const { ejsPuppeteerPdfGenerator } = require("../pdf_generators/PdfGenerator");
const { changeDateFormat } = require("../util/dateTimeFormattor");
const { downloadAndConvertImage } = require("../util/downloadImageAndConvertInBase64");
const { ejsRender } = require("../util/templateEngine");
const ejsUtils = require('../util/ejsUtils');
const { getCommonOptions } = require('../util/utils');

// const options = {
//   orientation: "portrait",
//   printBackground: true,
//   format: "A4",
//   displayHeaderFooter: true,
// };

class TradeLicenseRenew {
  constructor() {}

  handleDateTimeFormat(formValue) {
    //DATE TIME FORMAT: 13 August 2022
    changeDateFormat(formValue, "validTill");
  }

  async getOwnerPhoto(formValue) {
    if (
      formValue &&
      formValue.photograph &&
      formValue.photograph.length > 0 &&
      formValue.photograph[0].url
    ) {
      formValue["ownerPhoto"] = await downloadAndConvertImage(
        formValue.photograph[0].url
      );
    } else {
      formValue["ownerPhoto"] = "";
    }
  }

  handlePassportAndNidNo = (formValue) => {
    if (formValue.nationality === "Bangladeshi") {
      formValue.passportNumber = formValue.nidNo;
    }
  };

  async generate(body) {
    this.handleDateTimeFormat(body.formValue);
    await this.getOwnerPhoto(body.formValue);
    this.handlePassportAndNidNo(body.formValue);

    body.formValue.utils = ejsUtils;

    const initialTemplate = fs.readFileSync(
      "./ejs_pdf_templates/trade-license-renew/trade-license-renew.ejs",
      "utf-8"
    );
    const initialHeaderTemplate = fs.readFileSync('./ejs_pdf_templates/trade-license-renew/header-template.ejs', 'utf-8')

    const pageStyle = `
          @page {
            margin-top: 130px;
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

module.exports = TradeLicenseRenew;
