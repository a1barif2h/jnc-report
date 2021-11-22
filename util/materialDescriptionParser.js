// const { response } = require("express");

const parseMaterialDescription = function (materialsDes, template) {
  for (var key in materialsDes) {
    template = template.replaceAll("{{" + key + "}}", materialsDes[key] || "-");
  }
  return template;
};
const generateMultipleMaterialsDescription = function (data, htmlTemplate, materialsTemplate) {
  
    htmlTemplate += parseMaterialDescription(data[i]);
    const pageBreak = '<div class="container container-page-break">';
    for (let i=1;i<data.length;i++) {
        if(i%2==1){
            htmlTemplate+=pageBreak;
        }
        htmlTemplate += parseMaterialDescription(data[i], materialsTemplate);
        if(i%2==0){
            htmlTemplate += "</div>";
        }
    }
    return htmlTemplate;
};
module.exports = { parseMaterialDescription };
