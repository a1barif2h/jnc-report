const { response } = require("express");
const fs = require("fs");
const { changeDateFormat } = require("../util/dateTimeFormattor");
const logger = require("../util/logger");
const { keyRemover, replacer, doubleNaTextRemover } = require("../util/templateEngine");

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


if (process.env.NODE_ENV !== "production") {
  logger.info(`adding childProcessOptions for creating pdf in staging`)
  options.childProcessOptions = {
    env: {
      OPENSSL_CONF: '/dev/null',
    },
  }
}


class WorkPermit {
  constructor() {
  }

  handleDateTimeFormat(formValue) {
    //DATE TIME FORMAT: 13 August 2022
    changeDateFormat(formValue, "startDate");
    changeDateFormat(formValue, "applicationDate");
  }

  async generate(body) {
    this.handleDateTimeFormat(body.formValue)
    body.formValue.plotAddress = body.formValue?.plotAddress ? `<b>Plot# ${body.formValue?.plotAddress}</b>` : "<b style='display: none;'>don't display</b>"
    let htmlTemplate = fs.readFileSync(
      "./pdf_templates/work-permit/work-permit.html",
      "utf8"
    );
    let remunerationBoxHtmlTemplate = fs.readFileSync("./pdf_templates/work-permit/remuneration-box.html", "utf8")
    remunerationBoxHtmlTemplate = replacer(remunerationBoxHtmlTemplate, body.formValue);
    // THIS IS NEW REQUIREMENT LOGIC 
    const type_visa = body.formValue.typeOfVisaObtainedForTheIncumbentForeignNationals;
    if (type_visa !== "E - Employment Visa" || type_visa !== "PI - Private Investor Visa") {
      remunerationBoxHtmlTemplate = keyRemover(remunerationBoxHtmlTemplate); // THIS LINE NEED TO CLEAN PREVIOUS VISA TYPE KEY
      remunerationBoxHtmlTemplate = doubleNaTextRemover(remunerationBoxHtmlTemplate)
    }
    body.formValue.remunerationBox = remunerationBoxHtmlTemplate;

    const response = await pdf.generatePdfFromHtml(htmlTemplate, body, options);
    return response;
  }
}
module.exports = WorkPermit;
