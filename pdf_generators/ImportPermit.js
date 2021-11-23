const { response } = require("express");
const fs = require("fs");
const htmlTemplate = fs.readFileSync(
  "./pdf_templates/import-permit/import-permit.html",
  "utf8"
);
const materialsDetailsTemplateInitial = fs.readFileSync(
  "./pdf_templates/import-permit/materialsDetails.html",
  "utf8"
);
const pdf = require("./PdfGenerator");
const options = { format: "A4", orientation: "portrait" };

const materialsDescriptionParser = require("../util/materialDescriptionParser.js");
class ImportPermit {
  constructor() {}

  async generate(body) {
    
    let htmlImportTemplate = htmlTemplate;
    htmlImportTemplate = materialsDescriptionParser.parseJasonIntoHtml(
      body.formValue,
      htmlImportTemplate
    );
    let materialsDetailsTemplate = materialsDetailsTemplateInitial;
    if(body.formValue.dataGrid.length!=1){
      materialsDetailsTemplate = materialsDetailsTemplate.replace(
        `{{footerHere}}`,
        ""
      );
    }
    // materialsDetailsTemplate = materialsDetailsTemplateInitial;
    let firstMaterialsDetails = materialsDescriptionParser.parseJasonIntoHtml(
      body.formValue.dataGrid[0],
      materialsDetailsTemplate
    );
    htmlImportTemplate = htmlImportTemplate.replace(
      `{{firstMaterialsDetails}}`,
      firstMaterialsDetails || "-"
    );
    console.log("matarialDescription:   " + firstMaterialsDetails);
    
    materialsDetailsTemplate = materialsDetailsTemplateInitial;
    let remainingMaterialsDetails =
      materialsDescriptionParser.generateMultipleMaterialsDescription(
        body.formValue,
        materialsDetailsTemplate
      );
    htmlImportTemplate = htmlImportTemplate.replace(
      `{{remainingMaterialsDetails}}`,
      remainingMaterialsDetails || "-"
    );
    
    console.log("==========================================\n\n\n");
    console.log("remainingMaterialsDetails:   " + remainingMaterialsDetails);
    
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
