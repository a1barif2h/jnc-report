const fs = require("fs");
const { changeDateFormat } = require("../util/dateTimeFormattor");
const { downloadAndConvertImage } = require("../util/downloadImageAndConvertInBase64");
const logger = require("../util/logger");

const pdf = require("./PdfGenerator");
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
// if(process.env.NODE_ENV !== "production") {
  // logger.info(`adding childProcessOptions for creating pdf in staging`)
  options.childProcessOptions = {
    env: {
      OPENSSL_CONF: '/dev/null',
    },
  }
// }

class TradeLicense {
  constructor() {}

  handleDateTimeFormat(formValue) {
    //DATE TIME FORMAT: 13 August 2022
    changeDateFormat(formValue, "validTill");
  }

  async getOwnerPhoto(formValue) {
    if(
      formValue &&
      formValue.photograph &&
      formValue.photograph.length > 0 &&
      formValue.photograph[0].url
    ) {
      formValue["ownerPhoto"] = await downloadAndConvertImage(formValue.photograph[0].url)
    } else {
      formValue["ownerPhoto"] = ""
    }
  }

  async generate(body) {
    this.handleDateTimeFormat(body.formValue)
    await this.getOwnerPhoto(body.formValue)

    let htmlTemplate = fs.readFileSync(
      "./pdf_templates/trade-license/trade-license.html",
      "utf8"
    );
    const response = await pdf.generatePdfFromHtml(htmlTemplate, body, options);
    return response;
  }

}

module.exports = TradeLicense;
