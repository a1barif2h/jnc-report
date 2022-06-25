const { response } = require("express");
const fs = require("fs");

const pdf = require("./PdfGenerator");
const options = { format: "A4", orientation: "portrait" };

const materialsDescriptionParser = require("../util/materialDescriptionParser.js");
class LocalSalesPermit {
  constructor() {}

  async generate(body) {
    let htmlTemplate = fs.readFileSync(
      "./pdf_templates/local-sales-permit/local-sales-permit.html",
      "utf8"
    );
    let headerTemplate = fs.readFileSync(
      "./pdf_templates/local-sales-permit/headerTemplate.html",
      "utf8"
    );
    let materialsDetailsTemplateInitial = fs.readFileSync(
      "./pdf_templates/local-sales-permit/materialsDetails.html",
      "utf8"
    );
    headerTemplate = materialsDescriptionParser.parseJasonIntoHtml(
      body.formValue,
      headerTemplate
    );
    let htmlImportTemplate = htmlTemplate;
    htmlImportTemplate = materialsDescriptionParser.parseJasonIntoHtml(
      body.formValue,
      htmlImportTemplate
    );
    htmlImportTemplate = htmlImportTemplate.replace(
      `{{headerHere}}`,
      headerTemplate.toString() || "-"
    );
    let materialsDetailsTemplate = materialsDetailsTemplateInitial;

    htmlImportTemplate = materialsDescriptionParser.addFirstMaterials(
      body.formValue.PurchaseDetailsGroup,
      materialsDetailsTemplate,
      htmlImportTemplate,
      headerTemplate
    );

    // console.log("==========================================");
    materialsDetailsTemplate = materialsDetailsTemplateInitial;
    htmlImportTemplate = materialsDescriptionParser.addRemainingMaterials(
      body.formValue.PurchaseDetailsGroup,
      materialsDetailsTemplate,
      htmlImportTemplate,
      headerTemplate
    );
    // if (body.formValue.dataGrid.length!=1){

    // }
    const response = await pdf.generatePdfFromHtmlMultipleMaterialDescription(
      htmlImportTemplate,
      options
    );

    return response;
  }
}

module.exports = LocalSalesPermit;
