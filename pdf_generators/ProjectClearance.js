const { response } = require("express");
const fs = require("fs");
const pdf = require("./PdfGenerator");
const options = { format: "A4", orientation: "portrait" };
const background_image = fs.readFileSync(
  "./pdf_templates/background_image.html",
  "utf8"
);
const background_cancelled = fs.readFileSync(
  "./pdf_templates/background_cancelled.html",
  "utf8"
);
const replaceMaterialsInProjectClearance = require("../util/replaceMaterialsInProjectClearance");
const { logger } = require("../util/helper");
const currencyConverter = require("../util/currencyConverter");

class ProjectClearance {
  constructor() {}

  #getCurrencyList(additionOfMachinery) {
    const currencies = {};
    additionOfMachinery.length > 0 && additionOfMachinery.map((machinery) => {
      const currencyName = machinery.valueCurrency;
      const currencyValue = machinery.valueInput;
      if (currencies[currencyName]) {
        currencies[currencyName] = currencies[currencyName] + currencyValue;
      } else {
        currencies[currencyName] = currencyValue;
      }
    })
    return currencies;
  }

  async generate(body) {

    const currencyList = this.#getCurrencyList(body.formValue?.additionOfMachinery)
    body.formValue.machineryCurrencyValue = await currencyConverter(currencyList, "USD");
    body.formValue.machineryCurrency = "USD";
    let htmlTemplate = fs.readFileSync(
      "./pdf_templates/project-clearance/project-clearance.html",
      "utf8"
    );
    let materialsDesTemplate = fs.readFileSync(
      "./pdf_templates/project-clearance/project-clearance-materials-description.html",
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
      console.log(exceptionVar);
    }
    const response = await pdf.generatePdfFromHtml(htmlTemplate, body, options);
    return response;
  }
}

module.exports = ProjectClearance;
