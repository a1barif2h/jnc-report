const fs = require("fs");
const { ejsRender } = require("../util/templateEngine");
const { getCommonOptions } = require("../util/utils");
const { ejsPuppeteerPdfGenerator } = require("../pdf_generators/PdfGenerator");
const ejsUtils = require("../util/ejsUtils");
const { CARRIER_TYPE } = require("../constants/const");
const { changeDateFormat } = require("../util/dateTimeFormattor");
const { numberWithCommas } = require("../util/amountToWordUtil");

class ImportPermit {
  constructor() {}

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

    return (
      type_visa === eType ||
      type_visa === piType ||
      type_visa === a3Type ||
      type_visa === eiType
    );
  }

  handleAmountThousandsSeparator(formValue) {
    for (let i = 0; i < 7; i++) {
      formValue[`amountLocally${i !== 0 ? i : ""}`] = numberWithCommas(
        formValue[`amountLocally${i !== 0 ? i : ""}`]
      );
      formValue[`amountAbroad${i !== 0 ? i : ""}`] = numberWithCommas(
        formValue[`amountAbroad${i !== 0 ? i : ""}`]
      );
    }
  }

  async generate(body) {
    this.handleDateTimeFormat(body.formValue);
    if (this.checkIsNeedThousandsSeparator(body.formValue)) {
      this.handleAmountThousandsSeparator(body.formValue);
    }

    body.formValue.plotAddress = body.formValue?.plotAddress
      ? `<b>Plot# ${body.formValue?.plotAddress}</b>`
      : "<b style='display: none;'>don't display</b>";

    const type_visa =
      body.formValue.typeOfVisaObtainedForTheIncumbentForeignNationals;
     
    body.formValue.type_visa = type_visa;

    body.formValue.utils = ejsUtils;

    const initialTemplate = fs.readFileSync(
      "./ejs_pdf_templates/work-permit/work-permit.ejs",
      "utf8"
    );
    const initialHeaderTemplate = fs.readFileSync(
      "./ejs_pdf_templates/work-permit/header-template.ejs",
      "utf8"
    );

    const headerTemplate = ejsRender(initialHeaderTemplate, body);
    const generateTemplate = ejsRender(initialTemplate, body);

    const options = {
      ...getCommonOptions(body),
      headerTemplate,
    };

    const pageStyle = `
            @page {
                margin-top: 150px;
                margin-bottom: 200px;
            }
        `;

    const generatedPdf = ejsPuppeteerPdfGenerator(
      generateTemplate,
      options,
      pageStyle
    );

    return generatedPdf;
  }
}

module.exports = ImportPermit;
