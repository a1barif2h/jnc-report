const { response } = require("express");
const fs = require("fs");
htmlTemplate = fs.readFileSync(
  "./pdf_templates/export-permit/export-permit.html",
  "utf8"
);
headerTemplate = fs.readFileSync(
  "./pdf_templates/export-permit/export-multipage-header.html",
  "utf8"
);

materialsDetailsTemplateInitial = fs.readFileSync(
  "./pdf_templates/export-permit/export-material-group.html",
  "utf8"
);

footerTemplate = fs.readFileSync(
  "./pdf_templates/export-permit/export-permit-footer.html",
  "utf8"
);

const pdf = require("./PdfGenerator");
const options = { format: "A4", orientation: "portrait" };
const dateTimeFormattor = require("../util/dateTimeFormattor");
const templateEngine = require("../util/templateEngine");

const materialsDescriptionParser = require("../util/materialDescriptionParser.js");

class ExportPermit {
  constructor() {}

  async generate(body) {
    
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
    
    console.log("ExportTemplate:");
    console.log(htmlImportTemplate);
    let materialsDetailsTemplate = materialsDetailsTemplateInitial;
    
    htmlImportTemplate = materialsDescriptionParser.addFirstMaterials(
      body.formValue.dataGrid,
      materialsDetailsTemplate,
      htmlImportTemplate,
      headerTemplate
    );

    console.log("==========================================");
    materialsDetailsTemplate = materialsDetailsTemplateInitial;
    htmlImportTemplate = materialsDescriptionParser.addRemainingMaterials(
      body.formValue.dataGrid,
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
