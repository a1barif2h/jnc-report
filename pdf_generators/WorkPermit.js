const { response } = require("express");
const fs = require("fs");
const { numberWithCommas } = require("../util/amountToWordUtil");
const { changeDateFormat } = require("../util/dateTimeFormattor");
const logger = require("../util/logger");
const { keyRemover, replacer, doubleNaTextRemover, NaDashTextRemover } = require("../util/templateEngine");

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
  // logger.info(`adding childProcessOptions for creating pdf in staging`)
  options.childProcessOptions = {
    env: {
      OPENSSL_CONF: '/dev/null',
    },
  }
// }


class WorkPermit {
  constructor() {
  }

  handleDateTimeFormat(formValue) {
    //DATE TIME FORMAT: 13 August 2022
    changeDateFormat(formValue, "startDateBeza");
    changeDateFormat(formValue, "applicationDate");
  }

  checkIsNeedThousandsSeparator(formValue) {
    let type_visa = formValue.typeOfVisaObtainedForTheIncumbentForeignNationals;
    let eType = "E - Employment Visa";
    let piType = "PI - Private Investor Visa";
    let a3Type = "A3 - Work on Government Projects Visa";
    let eiType = "EI - Employment Type -1 Visa";

    return type_visa === eType || type_visa === piType || type_visa === a3Type || type_visa === eiType;
  }

  handleAmountThousandsSeparator(formValue) {
    for (let i = 0; i < 7; i++) {
      formValue[`amountLocally${i !== 0 ? i : ""}`] = numberWithCommas(formValue[`amountLocally${i !== 0 ? i : ""}`])
      formValue[`amountAbroad${i !== 0 ? i : ""}`] = numberWithCommas(formValue[`amountAbroad${i !== 0 ? i : ""}`])
    }
  }

  async generate(body) {
    this.handleDateTimeFormat(body.formValue)
    if(this.checkIsNeedThousandsSeparator(body.formValue)) {
      this.handleAmountThousandsSeparator(body.formValue)
    }
    
    body.formValue.plotAddress = body.formValue?.plotAddress ? `<b>Plot# ${body.formValue?.plotAddress}</b>` : "<b style='display: none;'>don't display</b>"
    let htmlTemplate = fs.readFileSync(
      "./pdf_templates/work-permit/work-permit.html",
      "utf8"
    );
    let remunerationBoxHtmlTemplate = fs.readFileSync("./pdf_templates/work-permit/remuneration-box.html", "utf8")
    remunerationBoxHtmlTemplate = replacer(remunerationBoxHtmlTemplate, body.formValue);
    // THIS IS NEW REQUIREMENT LOGIC 
    const type_visa = body.formValue.typeOfVisaObtainedForTheIncumbentForeignNationals;
    let eType = "E - Employment Visa";
    let piType = "PI - Private Investor Visa";
    let a3Type = "A3 - Work on Government Projects Visa";
    let eiType = "EI - Employment Type -1 Visa";
    
    if (type_visa !== eType || type_visa !== piType || type_visa !== a3Type || type_visa !== eiType) {
      remunerationBoxHtmlTemplate = keyRemover(remunerationBoxHtmlTemplate); // THIS LINE NEED TO CLEAN PREVIOUS VISA TYPE KEY
      remunerationBoxHtmlTemplate = doubleNaTextRemover(remunerationBoxHtmlTemplate);
    }
    remunerationBoxHtmlTemplate = NaDashTextRemover(remunerationBoxHtmlTemplate)
    body.formValue.remunerationBox = remunerationBoxHtmlTemplate;

    const response = await pdf.generatePdfFromHtml(htmlTemplate, body, options);
    return response;
  }
}
module.exports = WorkPermit;
