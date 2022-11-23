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
if(process.env.NODE_ENV !== "production") {
  logger.info(`adding childProcessOptions for creating pdf in staging`)
  options.childProcessOptions = {
    env: {
      OPENSSL_CONF: '/dev/null',
    },
  }
}


class TradeLicenseRenew {
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
      "./pdf_templates/trade-license-renew/trade-license-renew.html",
      "utf8"
    );
    let authorizePositionFormatted = "";
    let isOwner = false,
      isMd = false,
      isChairman = false;
    if (body.formValue.authorizePosition.owner) {
      authorizePositionFormatted += "Owner";
      isOwner = true;
    }
    if (body.formValue.authorizePosition.manningDirector) {
      if (isOwner) authorizePositionFormatted += ", ";
      authorizePositionFormatted += "Managing Director";
      isMd = true;
    }
    if (body.formValue.authorizePosition.chairmanInformation) {
      if (isMd || (!isMd && isOwner)) authorizePositionFormatted += ", ";
      authorizePositionFormatted += "Chairman";
    }

    body.formValue.authorizeIdentity = body.formValue.passportNumber ? body.formValue.passportNumber : body.formValue.nidNo ? body.formValue.nidNo : "";

    body.formValue.authorizePositionFormatted = authorizePositionFormatted;
    const response = await pdf.generatePdfFromHtml(htmlTemplate, body, options);
    return response;
  }

}

module.exports = TradeLicenseRenew;
