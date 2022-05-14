// const { response } = require("express");
const { response } = require("express");
const fs = require("fs");
var footerTemplate = fs.readFileSync(
  "./pdf_templates/import-permit/footer.html",
  "utf8"
);
// let headerTemplate = fs.readFileSync(
//   "./pdf_templates/import-permit/headerTemplate.html",
//   "utf8"
// );

const parseJasonIntoHtml = function (json, template) {
  for (var key in json) {
    // console.log(`json[${key}] = ${json[key]}`)
    template = template.replaceAll("{{" + key + "}}", json[key] || "-");
  }
  return template;
};
const generateMultipleMaterialsDescription = function (
  dataGrid,
  materialsTemplate,
  headerTemplate
) {
  // if (data.length == 0) {
  //   return "";
  // }
  // const dataGrid = data.dataGrid;
  let materialsDescriptionTemplate = "";
  // materialsDescriptionTemplate += parseJasonIntoHtml(
  //   dataGrid[0],
  //   materialsTemplate
  // );
  const pageBreak = '<div class="mainContainer pageBreak">';
  for (let i = 1; i < dataGrid.length; i++) {
    let tempmaterialsTemplate = materialsTemplate;
    if (i == dataGrid.length - 1) {
      // console.log("iiiiiiiiiiii:   " + footerTemplate);
      tempmaterialsTemplate = tempmaterialsTemplate.replace(
        `{{footerHere}}`,
        footerTemplate.toString() || "-"
      );
    } else {
      tempmaterialsTemplate = tempmaterialsTemplate.replace(
        `{{footerHere}}`,
        ""
      );
    }
    if (i % 2 == 1) {
      materialsDescriptionTemplate += pageBreak;

      tempmaterialsTemplate = tempmaterialsTemplate.replace(
        `{{headerHere}}`,
        headerTemplate.toString()
      );
      // console.log("pagebreak added!  " + i);
    } else {
      tempmaterialsTemplate = tempmaterialsTemplate.replace(
        `{{headerHere}}`,
        ""
      );
    }
    materialsDescriptionTemplate += parseJasonIntoHtml(
      dataGrid[i],
      tempmaterialsTemplate
    );

    if (i % 2 == 0) {
      materialsDescriptionTemplate += "</div>";
      // console.log("</div>  added: " + i);
    }
  }

  // if (dataGrid.length >1) {

  // }
  if (dataGrid.length != 0 && dataGrid.length % 2 == 0) {
    materialsDescriptionTemplate += "</div>";
    // console.log("</div>  added: " + dataGrid.length);
  }

  return materialsDescriptionTemplate;
};
const addFirstMaterials = function (
  dataGrid,
  materialsDetailsTemplate,
  htmlExportTemplate,
  headerTemplate
) {
  if (dataGrid.length != 1) {
    materialsDetailsTemplate = materialsDetailsTemplate.replace(
      `{{footerHere}}`,
      ""
    );
  } else {
    materialsDetailsTemplate = materialsDetailsTemplate.replace(
      `{{footerHere}}`,
      footerTemplate.toString() || "-"
    );
  }
  materialsDetailsTemplate = materialsDetailsTemplate.replace(
    `{{headerHere}}`,
    ""
  );
  let firstMaterialsDetails = parseJasonIntoHtml(
    dataGrid[0],
    materialsDetailsTemplate
  );
  htmlExportTemplate = htmlExportTemplate.replace(
    `{{firstMaterialsDetails}}`,
    firstMaterialsDetails || "-"
  );
  // console.log("matarialDescription:   " + firstMaterialsDetails);
  return htmlExportTemplate;
};

const addRemainingMaterials = function (
  dataGrid,
  materialsDetailsTemplate,
  htmlExportTemplate,
  headerTemplate
) {
  if (dataGrid.length == 1) {
    htmlExportTemplate = htmlExportTemplate.replace(
      `{{remainingMaterialsDetails}}`,
      ""
    );
    return htmlExportTemplate;
  }
  let remainingMaterialsDetails = generateMultipleMaterialsDescription(
    dataGrid,
    materialsDetailsTemplate,
    headerTemplate
  );
  htmlExportTemplate = htmlExportTemplate.replace(
    `{{remainingMaterialsDetails}}`,
    remainingMaterialsDetails || "-"
  );

  // console.log("==========================================\n\n\n");
  // console.log("remainingMaterialsDetails:   " + remainingMaterialsDetails);
  return htmlExportTemplate;
};
module.exports = {
  parseJasonIntoHtml,
  generateMultipleMaterialsDescription,
  addFirstMaterials,
  addRemainingMaterials,
};
