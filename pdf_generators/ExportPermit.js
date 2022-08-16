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
    
    headerTemplate = materialsDescriptionParser.parseJasonIntoHtml(
      body.formValue,
      headerTemplate
    );
    let htmlExportTemplate = htmlTemplate;
    
    // console.log("ExportTemplate:");
    // console.log(htmlExportTemplate);
    // console.log("57",body)
    htmlExportTemplate = materialsDescriptionParser.parseJasonIntoHtml(
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
      lcInfoDetailsTemplate,
      lcInfLabelTemplate
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

// const addRemainingMaterials = function (
//   dataGrid,
//   materialsDetailsTemplate,
//   htmlExportTemplate,
//   headerTemplate
// ) {
//   if (dataGrid.length == 1) {
//     htmlExportTemplate = htmlExportTemplate.replace(
//       `{{remainingMaterialsDetails}}`,
//       ""
//     );
//     return htmlExportTemplate;
//   }
//   let remainingMaterialsDetails = generateMultipleMaterialsDescription(
//     dataGrid,
//     materialsDetailsTemplate,
//     headerTemplate
//   );
//   htmlExportTemplate = htmlExportTemplate.replace(
//     `{{remainingMaterialsDetails}}`,
//     remainingMaterialsDetails || "-"
//   );

//   console.log("==========================================\n\n\n");
//   console.log("remainingMaterialsDetails:   " + remainingMaterialsDetails);
//   return htmlExportTemplate;
// };


// const addFirstMaterials = function (
//   dataGrid,
//   materialsDetailsTemplate,
//   htmlExportTemplate,
//   headerTemplate
// ) {
//   if (dataGrid.length != 1) {
//     materialsDetailsTemplate = materialsDetailsTemplate.replace(
//       `{{footerHere}}`,
//       ""
//     );
//   } else {
//     materialsDetailsTemplate = materialsDetailsTemplate.replace(
//       `{{footerHere}}`,
//       footerTemplate.toString() || "-"
//     );
//   }
//   materialsDetailsTemplate = materialsDetailsTemplate.replace(
//     `{{headerHere}}`,
//     ""
//   );
//   let firstMaterialsDetails = materialsDescriptionParser.parseJasonIntoHtml(
//     dataGrid[0],
//     materialsDetailsTemplate
//   );
//   htmlExportTemplate = htmlExportTemplate.replace(
//     `{{firstMaterialsDetails}}`,
//     firstMaterialsDetails || "-"
//   );
//   console.log("matarialDescription:   " + firstMaterialsDetails);
//   return htmlExportTemplate;
// };

// const parseJasonIntoHtml = function (json, template) {
//   for (var key in json) {
//     template = template.replaceAll("{{" + key + "}}", json[key] || "-");
//   }
//   return template;
// };

// const generateMultipleMaterialsDescription = function (
//   dataGrid,
//   materialsTemplate,
//   headerTemplate
// ) {
//   // if (data.length == 0) {
//   //   return "";
//   // }
//   // const dataGrid = data.dataGrid;
//   let materialsDescriptionTemplate = "";
//   // materialsDescriptionTemplate += parseJasonIntoHtml(
//   //   dataGrid[0],
//   //   materialsTemplate
//   // );
//   const pageBreak = '<div class="mainContainer pageBreak">';
//   for (let i = 1; i < dataGrid.length; i++) {
//     let tempmaterialsTemplate = materialsTemplate;
//     if (i == dataGrid.length - 1) {
//       console.log("iiiiiiiiiiii:   " + footerTemplate);
//       tempmaterialsTemplate = tempmaterialsTemplate.replace(
//         `{{footerHere}}`,
//         footerTemplate.toString() || "-"
//       );
//     } else {
//       tempmaterialsTemplate = tempmaterialsTemplate.replace(
//         `{{footerHere}}`,
//         ""
//       );
//     }
//     if (i % 3 == 1) {
//       materialsDescriptionTemplate += pageBreak;

//       tempmaterialsTemplate = tempmaterialsTemplate.replace(
//         `{{headerHere}}`,
//         headerTemplate.toString()
//       );
//       console.log("pagebreak added!  " + i);
//     } else {
//       tempmaterialsTemplate = tempmaterialsTemplate.replace(
//         `{{headerHere}}`,
//         ""
//       );
//     }
//     materialsDescriptionTemplate += materialsDescriptionParser.parseJasonIntoHtml(
//       dataGrid[i],
//       tempmaterialsTemplate
//     );

//     if (i % 3 == 0) {
//       materialsDescriptionTemplate += "</div>";
//       console.log("</div>  added: " + i);
//     }
//   }

//   // if (dataGrid.length >1) {

//   // }
//   if (dataGrid.length != 0 && dataGrid.length % 2 == 0) {
//     materialsDescriptionTemplate += "</div>";
//     console.log("</div>  added: " + dataGrid.length);
//   }

//   return materialsDescriptionTemplate;
// };

module.exports = ExportPermit;
