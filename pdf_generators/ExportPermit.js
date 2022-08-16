const { response } = require("express");
const fs = require("fs");


const pdf = require("./PdfGenerator");
const options = { format: "A4", orientation: "portrait" };
const dateTimeFormattor = require("../util/dateTimeFormattor");
const templateEngine = require("../util/templateEngine");

const materialsDescriptionParser = require("../util/materialDescriptionParser.js");

class ExportPermit {
  constructor() {}

  async generate(body) {
    let htmlTemplate = fs.readFileSync(
      "./pdf_templates/export-permit/export-permit.html",
      "utf8"
    );
    let headerTemplate = fs.readFileSync(
      "./pdf_templates/export-permit/export-multipage-header.html",
      "utf8"
    );
    
    let materialsDetailsTemplateInitial = fs.readFileSync(
      "./pdf_templates/export-permit/export-material-group.html",
      "utf8"
    );
    
    let footerTemplate = fs.readFileSync(
      "./pdf_templates/export-permit/export-permit-footer.html",
      "utf8"
    );

    let materialLabelTemplate = fs.readFileSync(
      "./pdf_templates/export-permit/materialDetailsLabel.html",
      "utf8"
    );

    const lcInfoDetailsTemplateinitial = fs.readFileSync(
      "./pdf_templates/export-permit/lcsInformationsDetails.html",
      "utf8");

      let lcInfLabelTemplate = fs.readFileSync(
        "./pdf_templates/export-permit/lcInfoDetailsLabel.html",
        "utf8"
      );
    
    headerTemplate = materialsDescriptionParser.addJsonValuesIntoHtml(
      body.formValue,
      headerTemplate
    );
    let htmlExportTemplate = htmlTemplate;
    
    // console.log("ExportTemplate:");
    // console.log(htmlExportTemplate);
    // console.log("57",body)
    htmlExportTemplate = materialsDescriptionParser.addJsonValuesIntoHtml(
      body.formValue,
      htmlExportTemplate
    );
    htmlExportTemplate = htmlExportTemplate.replace(
      `{{headerHere}}`,
      headerTemplate.toString() || "-"
    );
    
    let materialsDetailsTemplate = materialsDetailsTemplateInitial;

    htmlExportTemplate = materialsDescriptionParser.addFirstTwoMaterialDescriptions(
      body.formValue.exportMaterialsInformationGroup,
      materialsDetailsTemplate,
      htmlExportTemplate,
      headerTemplate,
      materialLabelTemplate
    );

    let lcInfoDetailsTemplate = lcInfoDetailsTemplateinitial;

    htmlExportTemplate = materialsDescriptionParser.addMaterialsDescriptions(
      body.formValue.exportMaterialsInformationGroup,
      materialsDetailsTemplate,
      htmlExportTemplate,
      headerTemplate,
      materialLabelTemplate,
      body.formValue.ttPOScCmLCInformationContainer,
      lcInfoDetailsTemplate
    );

    htmlExportTemplate = materialsDescriptionParser.addLcInfos(
      body.formValue.ttPOScCmLCInformationContainer,
      lcInfoDetailsTemplate,
      htmlExportTemplate,
      headerTemplate,
      lcInfLabelTemplate,
      body.formValue.exportMaterialsInformationGroup.length,
      materialLabelTemplate
    );


    
    // htmlExportTemplate = materialsDescriptionParser.addFirstMaterials(
    //   body.formValue.exportMaterialsInformationGroup,
    //   materialsDetailsTemplate,
    //   htmlExportTemplate,
    //   headerTemplate
    // );

    // console.log("==========================================");
    //materialsDetailsTemplate = materialsDetailsTemplateInitial;
    // htmlExportTemplate = materialsDescriptionParser.addRemainingMaterials(
    //   body.formValue.exportMaterialsInformationGroup,
    //   materialsDetailsTemplate,
    //   htmlExportTemplate,
    //   headerTemplate
    // );
    // if (body.formValue.dataGrid.length!=1){
      
    // }
    const response = await pdf.generatePdfFromHtmlMultipleMaterialDescription(
      htmlExportTemplate,
      options
    );

    return response;
  }
}

module.exports = ExportPermit;
