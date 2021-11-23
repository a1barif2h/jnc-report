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
module.exports = {
  parseJasonIntoHtml,
  generateMultipleMaterialsDescription,
};
