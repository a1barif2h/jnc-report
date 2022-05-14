const { response } = require("express");
const fs = require("fs");


const pdf = require("./PdfGenerator");
const options = { format: "A4", orientation: "portrait" };
const dateTimeFormattor = require("../util/dateTimeFormattor");
const templateEngine = require("../util/templateEngine");

const materialsDescriptionParser = require("../util/materialDescriptionParser.js");

class SampleImportPermit {
  constructor() {}

  async generate(body) {
    // CHANGE DATE FORMATE
    body.formValue.invoiceDate = dateTimeFormattor.getFormatDate(body.formValue.invoiceDate);
    if (body.formValue.issueDate) {
      body.formValue.issueDate = dateTimeFormattor.getFormatDate(body.formValue.issueDate);
    }
    body.formValue.expiredDateBeza = dateTimeFormattor.getFormatDate(body.formValue.expiredDateBeza);

    // HANDLE EXPIRE DATE AND PLACE OF ISSUE
    if (body.formValue.carrierType !== 'Hand Carry') {
      body.formValue.endTime = '';
      body.formValue.hiddenPlaceOfIssue = '';
    }
    
    let htmlTemplate = fs.readFileSync(
      "./pdf_templates/sample-import-permit/sample-import-permit.html",
      "utf8"
    );
    let headerTemplate = fs.readFileSync(
      "./pdf_templates/sample-import-permit/sample-import-permit-header.html",
      "utf8"
    );
    
    let materialsDetailsTemplateInitial = fs.readFileSync(
      "./pdf_templates/sample-import-permit/sample-import-permit-material_details.html",
      "utf8"
    );
    
    let footerTemplate = fs.readFileSync(
      "./pdf_templates/sample-import-permit/sample-import-permit-footer.html",
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
      body.formValue.sampleImportMaterialsInformationGroup,
      materialsDetailsTemplate,
      htmlImportTemplate,
      headerTemplate
    );

    materialsDetailsTemplate = materialsDetailsTemplateInitial;
    htmlImportTemplate = materialsDescriptionParser.addRemainingMaterials(
      body.formValue.sampleImportMaterialsInformationGroup,
      materialsDetailsTemplate,
      htmlImportTemplate,
      headerTemplate
    );
    const response = await pdf.generatePdfFromHtmlMultipleMaterialDescription(
      htmlImportTemplate,
      options
    );

    return response;
  }  
}

module.exports = SampleImportPermit;
