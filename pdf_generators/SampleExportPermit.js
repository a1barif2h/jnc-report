const { response } = require("express");
const fs = require("fs");


const pdf = require("./PdfGenerator");
const options = { format: "A4", orientation: "portrait" };
const dateTimeFormattor = require("../util/dateTimeFormattor");
const templateEngine = require("../util/templateEngine");

const materialsDescriptionParser = require("../util/materialDescriptionParser.js");

class SampleExportPermit {
  constructor() {}

  async generate(body) {

    body.formValue.expiredDate = body.formValue.expiredDate !== "N/A" ? dateTimeFormattor.getFormatDate(body.formValue.expiredDate): body.formValue.expiredDate;

    let htmlTemplate = fs.readFileSync(
      "./pdf_templates/sample-export-permit/sample-export-permit.html",
      "utf8"
    );
    let headerTemplate = fs.readFileSync(
      "./pdf_templates/sample-export-permit/sample-export-multipage-header.html",
      "utf8"
    );
    
    let materialsDetailsTemplateInitial = fs.readFileSync(
      "./pdf_templates/sample-export-permit/sample-export-material-group.html",
      "utf8"
    );
    
    let footerTemplate = fs.readFileSync(
      "./pdf_templates/sample-export-permit/sample-export-permit-footer.html",
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
    
    htmlImportTemplate = materialsDescriptionParser.addFirstMaterials(
      body.formValue.productDetails,
      materialsDetailsTemplate,
      htmlImportTemplate,
      headerTemplate
    );
    // console.log("==========================================");
    materialsDetailsTemplate = materialsDetailsTemplateInitial;
    htmlImportTemplate = materialsDescriptionParser.addRemainingMaterials(
      body.formValue.productDetails,
      materialsDetailsTemplate,
      htmlImportTemplate,
      headerTemplate
    );
    // console.log("htmlSampleExportTemplate:");
    // console.log(htmlImportTemplate);
    // if (body.formValue.dataGrid.length!=1){
      
    // }
    const response = await pdf.generatePdfFromHtmlMultipleMaterialDescription(
      htmlImportTemplate,
      options
    );

    return response;
  }

  
}

module.exports = SampleExportPermit;
