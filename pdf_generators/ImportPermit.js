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
    htmlImportTemplate = materialsDescriptionParser.addFirstMaterials(
      body.formValue.dataGrid,
      materialsDetailsTemplate,
      htmlImportTemplate
    );

    console.log("==========================================");
    materialsDetailsTemplate = materialsDetailsTemplateInitial;
    htmlImportTemplate = materialsDescriptionParser.addRemainingMaterials(
      body.formValue,
      materialsDetailsTemplate,
      htmlImportTemplate
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

module.exports = ImportPermit;
