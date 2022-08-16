const { response } = require("express");
const fs = require("fs");

const pdf = require("./PdfGenerator");
const options = { format: "A4", orientation: "portrait" };

const materialsDescriptionParser = require("../util/materialDescriptionParser.js");
const { logger } = require("../util/helper");
class ImportPermit {
  constructor() {}

  async generate(body) {

    logger("import parmit body", body.formValue.ttPOScCmLCInformationContainer[0])
    let baseHtmlTemplate = fs.readFileSync(
      "./pdf_templates/import-permit/import-permit.html",
      "utf8"
    );
    let logoQrBarCodeHeaderTemplate = fs.readFileSync(
      "./pdf_templates/import-permit/headerTemplate.html",
      "utf8"
    );
    let materialLabelTemplate = fs.readFileSync(
      "./pdf_templates/import-permit/materialDetailsLabel.html",
      "utf8"
    );
    let lcInfLabelTemplate = fs.readFileSync(
      "./pdf_templates/import-permit/lcInfoDetailsLabel.html",
      "utf8"
    );
    const materialsDetailsTemplateInitial = fs.readFileSync(
      "./pdf_templates/import-permit/materialsDetails.html",
      "utf8"
    );

    const lcInfoDetailsTemplateinitial = fs.readFileSync(
      "./pdf_templates/import-permit/lcsInformationsDetails.html",
      "utf8");
    
    logoQrBarCodeHeaderTemplate = materialsDescriptionParser.addJsonValuesIntoHtml(
      body.formValue,
      logoQrBarCodeHeaderTemplate
    );

    let htmlImportTemplate = baseHtmlTemplate;
    htmlImportTemplate = materialsDescriptionParser.addJsonValuesIntoHtml(
      body.formValue,
      htmlImportTemplate
    );
    htmlImportTemplate = htmlImportTemplate.replace(
      `{{headerHere}}`,
      logoQrBarCodeHeaderTemplate.toString() || "-"
    );

    
    let materialsDetailsTemplate = materialsDetailsTemplateInitial;

    htmlImportTemplate = materialsDescriptionParser.addFirstTwoMaterialDescriptions(
      body.formValue.importMaterialsInformationGroup,
      materialsDetailsTemplate,
      htmlImportTemplate,
      logoQrBarCodeHeaderTemplate,
      materialLabelTemplate
    );

    let lcInfoDetailsTemplate = lcInfoDetailsTemplateinitial;

    htmlImportTemplate = materialsDescriptionParser.addMaterialsDescriptions(
      body.formValue.importMaterialsInformationGroup,
      materialsDetailsTemplate,
      htmlImportTemplate,
      logoQrBarCodeHeaderTemplate,
      materialLabelTemplate,
      body.formValue.ttPOScCmLCInformationContainer,
      lcInfoDetailsTemplate
    );


    htmlImportTemplate = materialsDescriptionParser.addLcInfos(
      body.formValue.ttPOScCmLCInformationContainer,
      lcInfoDetailsTemplate,
      htmlImportTemplate,
      logoQrBarCodeHeaderTemplate,
      lcInfLabelTemplate,
      body.formValue.importMaterialsInformationGroup.length,
      materialLabelTemplate
    );
    
    // htmlImportTemplate = materialsDescriptionParser.addFirstMaterials(
    //   body.formValue.importMaterialsInformationGroup,
    //   materialsDetailsTemplate,
    //   htmlImportTemplate,
    //   headerTemplate
    // );

    // console.log("==========================================");
    // materialsDetailsTemplate = materialsDetailsTemplateInitial;
    // htmlImportTemplate = materialsDescriptionParser.addRemainingMaterials(
    //   body.formValue.importMaterialsInformationGroup,
    //   materialsDetailsTemplate,
    //   htmlImportTemplate,
    //   headerTemplate
    // );
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
