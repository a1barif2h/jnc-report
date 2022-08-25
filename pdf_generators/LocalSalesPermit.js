const { response } = require("express");
const fs = require("fs");

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
    let footerTemplate = fs.readFileSync(
      "./pdf_templates/local-sales-permit/footer.html",
      "utf8"
    );
    headerTemplate = materialsDescriptionParser.addJsonValuesIntoHtml(
      body.formValue,
      headerTemplate
    );
    let htmlImportTemplate = htmlTemplate;
    htmlImportTemplate = materialsDescriptionParser.addJsonValuesIntoHtml(
      body.formValue,
      htmlImportTemplate
    );
    htmlImportTemplate = htmlImportTemplate.replace(
      `{{headerHere}}`,
      headerTemplate.toString() || "-"
    );
    let materialsDetailsTemplate = materialsDetailsTemplateInitial;

    htmlImportTemplate = materialsDescriptionParser.addFirstTwoMaterialDescriptions(
      body.formValue.PurchaseDetailsGroup,
      materialsDetailsTemplate,
      htmlImportTemplate,
      "",
      footerTemplate
    )

    materialsDetailsTemplate = materialsDetailsTemplateInitial;

    htmlImportTemplate = materialsDescriptionParser.addRemainingMaterialsDescription(
      body.formValue.PurchaseDetailsGroup,
      materialsDetailsTemplate,
      htmlImportTemplate,
      "",
      headerTemplate,
      footerTemplate
    )

    const response = await pdf.generatePdfFromHtmlMultipleMaterialDescription(
      htmlImportTemplate,
      options
    );

    return response;
  }
}

module.exports = LocalSalesPermit;
