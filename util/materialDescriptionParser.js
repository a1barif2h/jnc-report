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
    materialsDescriptionTemplate += parseJasonIntoHtml(data[0], materialsTemplate);
    const pageBreak = '<div class="container container-page-break">';
    for (let i=1;i<data.length;i++) {
        if(i%2==1){
            materialsDescriptionTemplate += pageBreak;
        }
        materialsDescriptionTemplate += parseJasonIntoHtml(data[i], materialsTemplate);
        if(i%2==0){
            materialsDescriptionTemplate += "</div>";
        }
    }
    if (data.length != 0 && data.length%2==0){
        materialsDescriptionTemplate += "</div>";
    }

    return materialsDescriptionTemplate;
};
module.exports = {
  parseJasonIntoHtml,
  generateMultipleMaterialsDescription,
};
