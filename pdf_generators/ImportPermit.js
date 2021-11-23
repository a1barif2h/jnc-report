const { response } = require("express");
const fs = require("fs");
const htmlTemplate = fs.readFileSync(
  "./pdf_templates/import-permit/import-permit.html",
  "utf8"
);
const materialsDetailsTemplate = fs.readFileSync(
  "./pdf_templates/import-permit/materialsDetails.html",
  "utf8"
);
const pdf = require("./PdfGenerator");
const options = { format: "A4", orientation: "portrait" };

const materialsDescriptionParser = require("../util/materialDescriptionParser.js");
class ImportPermit {
  constructor() {}

  async generate(body) {
    let matarialDescription =
      materialsDescriptionParser.generateMultipleMaterialsDescription(
        body.formValue,
        materialsDetailsTemplate
      );
    let htmlImportTemplate = htmlTemplate;
    htmlImportTemplate = materialsDescriptionParser.parseJasonIntoHtml(
      body.formValue,
      htmlImportTemplate
    );
    console.log("matarialDescription:   " + matarialDescription);
    htmlImportTemplate = htmlImportTemplate.replace(
      `{{allMaterialsDetails}}`,
      matarialDescription || "-"
    );
    // body.routePermitIssueDate = body.hasOwnProperty("routePermitIssueDate") ? body.routePermitIssueDate : "_";
    // body.routePermitExpDate = body.hasOwnProperty("routePermitExpDate") ? body.routePermitExpDate : "_";
    // body.fitnessIssueDate = body.hasOwnProperty("fitnessIssueDate") ? body.fitnessIssueDate : "_";
    // pdf.pdfGenerator(htmlTemplate, body, res, options)

    console.log("==========================================");
    // console.log("main html :   " + htmlImportTemplate);
    const response = await pdf.generatePdfFromHtmlMultipleMaterialDescription(
      htmlImportTemplate,
      options
    );

    return response;
  }
}

module.exports = ImportPermit;
