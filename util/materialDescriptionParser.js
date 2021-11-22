// const { response } = require("express");

const parseMaterialDescription = function (materialsDes, template) {
  for (var key in materialsDes) {
    template = template.replaceAll("{{" + key + "}}", materialsDes[key] || "-");
  }
  return template;
};
const generateMultipleMaterialsDescription = function (data, materialsTemplate) {
  
    materialsDescriptionTemplate += parseMaterialDescription(data[0], materialsTemplate);
    const pageBreak = '<div class="container container-page-break">';
    for (let i=1;i<data.length;i++) {
        if(i%2==1){
            materialsDescriptionTemplate += pageBreak;
        }
        materialsDescriptionTemplate += parseMaterialDescription(data[i], materialsTemplate);
        if(i%2==0){
            materialsDescriptionTemplate += "</div>";
        }
    }
    if (data.length != 0 && data.length%2==0){
        materialsDescriptionTemplate += "</div>";
    }
    return materialsDescriptionTemplate;
};
module.exports = { parseMaterialDescription };
