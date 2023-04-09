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
    logger.info("Start converting normal to thousands separator for sop: %s", formValue.sopCode)
    formValue["dCostOfTheProjectInUs"] = numberWithCommas(
      formValue["dCostOfTheProjectInUs"]
    );

    logger.info("Converting done")
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
      logger.info("Start calculate export total and local total")
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
      logger.info("Calculation done")
    } catch (exceptionVar) {
      logger.error("Something happen wrong when calculate")
      logger.error(exceptionVar);
    }
    logger.info("Start generate pdf buffer from generatePdfFromHtml")
    const response = await pdf.generatePdfFromHtml(htmlTemplate, body, options);
    return response;
  }
}

module.exports = ProjectRegistration;
