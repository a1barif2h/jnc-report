const fs = require("fs");
const pdf = require("./PdfGenerator");
const replaceMaterialsInProjectClearance = require("../util/replaceMaterialsInProjectClearance");
const logger = require("../util/logger");
const { changeDateFormat } = require("../util/dateTimeFormattor");
const { numberWithCommas } = require("../util/amountToWordUtil");

const options = {
  format: "A4",
  orientation: "portrait",
  footer: {
    height: "5mm",
    contents: {
      default:
        '<div id="pageFooter" style="text-align: center; font-size: 8px;">{{page}}/{{pages}}</div>',
    },
  },
};

// if (process.env.NODE_ENV !== "production") {
options.childProcessOptions = {
  env: {
    OPENSSL_CONF: "/dev/null",
  },
};
// }

class ProjectRegistration {
  constructor() {}

  handleDateTimeFormat(formValue) {
    //DATE TIME FORMAT: 13 August 2022
    changeDateFormat(formValue, "applicationDate");
  }

  handleAmountThousandsSeparator(formValue) {
    formValue["dCostOfTheProjectInUs"] = numberWithCommas(
      formValue["dCostOfTheProjectInUs"]
    );
  }

  async generate(body) {
    this.handleDateTimeFormat(body.formValue);
    this.handleAmountThousandsSeparator(body.formValue)

    body.formValue.industryCategory =
      body.formValue?.industryCategory.name || "";
    let htmlTemplate = fs.readFileSync(
      "./pdf_templates/project-registration/project-registration.html",
      "utf8"
    );
    let materialsDesTemplate = fs.readFileSync(
      "./pdf_templates/project-registration/project-registration-materials-description.html",
      "utf8"
    );

    try {
      let localTotal = body.formValue.domesticTotal;
      let exportTotal = body.formValue.exportTotal;
      localTotal = (localTotal * 100) / (localTotal + exportTotal);
      exportTotal = 100 - localTotal;
      materialsDesTemplate = materialsDesTemplate.replaceAll(
        `{{exportOrientedPercentage}}`,
        "" + exportTotal || "-"
      );
      materialsDesTemplate = materialsDesTemplate.replaceAll(
        `{{localOrientedPercentage}}`,
        "" + localTotal || "-"
      );
      materialsDesTemplate =
        replaceMaterialsInProjectClearance.replaceAllMaterialsValue(
          body,
          materialsDesTemplate
        );
      htmlTemplate = htmlTemplate.replace(
        `{{materialsDescription}}`,
        materialsDesTemplate || "-"
      );
    } catch (exceptionVar) {
      logger.error(exceptionVar);
    }
    const response = await pdf.generatePdfFromHtml(htmlTemplate, body, options);
    return response;
  }
}

module.exports = ProjectRegistration;
