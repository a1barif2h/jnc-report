// const { response } = require("express");

const parseJasonIntoHtml = function (json, template) {
  for (var key in json) {
    template = template.replaceAll("{{" + key + "}}", json[key] || "-");
  }
  return template;
};
const generateMultipleMaterialsDescription = function (data, materialsTemplate) {
    if (data.length == 0) {
      return "";
    }
    const dataGrid=data.dataGrid;
    let materialsDescriptionTemplate="";
    materialsDescriptionTemplate += parseJasonIntoHtml(
      dataGrid[0],
      materialsTemplate
    );
    const pageBreak = '<div class="container container-page-break">';
    for (let i = 1; i < dataGrid.length; i++) {
      if (i % 2 == 1) {
        materialsDescriptionTemplate += pageBreak;
        console.log("pagebreak added!  "+i);
      }
      materialsDescriptionTemplate += parseJasonIntoHtml(
        dataGrid[i],
        materialsTemplate
      );
      if (i % 2 == 0) {
        materialsDescriptionTemplate += "</div>";
        console.log("</div>  added: " + i);
      }
    }
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
