// const { response } = require("express");
const { response } = require("express");
const fs = require("fs");
const footerTemplate = fs.readFileSync(
  "./pdf_templates/import-permit/footer.html",
  "utf8"
);
const parseJasonIntoHtml = function (json, template) {
  for (var key in json) {
    template = template.replaceAll("{{" + key + "}}", json[key] || "-");
  }
  return template;
};
const generateMultipleMaterialsDescription = function (data, materialsTemplate) {
    // if (data.length == 0) {
    //   return "";
    // }
    const dataGrid=data.dataGrid;
    let materialsDescriptionTemplate="";
    // materialsDescriptionTemplate += parseJasonIntoHtml(
    //   dataGrid[0],
    //   materialsTemplate
    // );
    const pageBreak = '<div class="mainContainer pageBreak">';
    for (let i = 1; i < dataGrid.length; i++) {
      
      let tempmaterialsTemplate = materialsTemplate;
        if (i == dataGrid.length-1){
          console.log("iiiiiiiiiiii:   " + footerTemplate);
          tempmaterialsTemplate = tempmaterialsTemplate.replace(
            `{{footerHere}}`,
            footerTemplate.toString() || "-"
          );
        }
        else{
          tempmaterialsTemplate = tempmaterialsTemplate.replace(
            `{{footerHere}}`,
            ""
          );
        }
          if (i % 2 == 1) {
            materialsDescriptionTemplate += pageBreak;
            console.log("pagebreak added!  " + i);
          }
        materialsDescriptionTemplate += parseJasonIntoHtml(
          dataGrid[i],
          tempmaterialsTemplate
        );
        
        if (i % 2 == 0) {
          materialsDescriptionTemplate += "</div>";
          console.log("</div>  added: " + i);
        }
    }
    
    // if (dataGrid.length >1) {
      
    // }
    if (dataGrid.length != 0 && dataGrid.length % 2 == 0) {
      materialsDescriptionTemplate += "</div>";
        console.log("</div>  added: " + dataGrid.length);
    }

    return materialsDescriptionTemplate;
};
const addFirstMaterials=function(dataGrid,materialsDetailsTemplate,htmlImportTemplate){
  if (dataGrid.length != 1) {
    materialsDetailsTemplate = materialsDetailsTemplate.replace(
      `{{footerHere}}`,
      ""
    );
  }
  else{
    materialsDetailsTemplate = materialsDetailsTemplate.replace(
      `{{footerHere}}`,
      footerTemplate.toString()||"-"
    );
  }
  let firstMaterialsDetails =parseJasonIntoHtml(
    dataGrid[0],
    materialsDetailsTemplate
  );
  htmlImportTemplate = htmlImportTemplate.replace(
    `{{firstMaterialsDetails}}`,
    firstMaterialsDetails || "-"
  );
  console.log("matarialDescription:   " + firstMaterialsDetails);
  return htmlImportTemplate;
}

const addRemainingMaterials=function(formValue, materialsDetailsTemplate, htmlImportTemplate){
  
  if (formValue.dataGrid.length == 1) {
    htmlImportTemplate = htmlImportTemplate.replace(
      `{{remainingMaterialsDetails}}`,
      ""
    );
    return htmlImportTemplate;
  }
  let remainingMaterialsDetails = generateMultipleMaterialsDescription(
    formValue,
    materialsDetailsTemplate
  );
    htmlImportTemplate = htmlImportTemplate.replace(
      `{{remainingMaterialsDetails}}`,
      remainingMaterialsDetails || "-"
    );

  console.log("==========================================\n\n\n");
  console.log("remainingMaterialsDetails:   " + remainingMaterialsDetails);
  return htmlImportTemplate;
}
module.exports = {
  parseJasonIntoHtml,
  generateMultipleMaterialsDescription,
  addFirstMaterials,
  addRemainingMaterials,
};
