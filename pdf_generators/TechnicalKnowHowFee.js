const fs = require("fs");
const { changeDateFormat } = require("../util/dateTimeFormattor");
const logger = require("../util/logger");

const pdf = require('./PdfGenerator');
const options = {
  format: "A4",
  orientation: "portrait",
  footer: {
    height: '5mm',
    contents: {
      default:
        '<div id="pageFooter" style="text-align: center; font-size: 8px;">{{page}}/{{pages}}</div>',
    },
  }
};


// if (process.env.NODE_ENV !== "production") {
  logger.info(`adding childProcessOptions for creating pdf in staging`)
  options.childProcessOptions = {
    env: {
      OPENSSL_CONF: '/dev/null',
    },
  }
// }


class TechnicalKnowHowFee {
  constructor() {
  }

  handleDateTimeFormat(formValue) {
    //DATE TIME FORMAT: 13 August 2022
    changeDateFormat(formValue, "date");
    changeDateFormat(formValue, "applicationDate");
  }

  async generate(body) {
    this.handleDateTimeFormat(body.formValue)
    let htmlTemplate = fs.readFileSync(
      "./pdf_templates/technical-know-how-fee/technical-know-how-fee.html",
      "utf8"
    );

    logger.info("this is for test")

    const response = await pdf.generatePdfFromHtml(htmlTemplate, body, options);
    return response;
  }
}
module.exports = TechnicalKnowHowFee;
