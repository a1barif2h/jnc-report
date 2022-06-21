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

const addLcInfos = function(dataGrid, lcInfoDetailsTemplate, htmlExportTemplate, headerTemplate, lcInfLabelTemplate ,materialsLength){
  let j = materialsLength;
  let lcInfoDetailsTemplates = "";
  let firstLcInfoDetailsTemplate = lcInfoDetailsTemplate;
  const pageBreak = '<div class="mainContainer pageBreak">';

  if((j+1) % 3 == 0){
    lcInfoDetailsTemplates+=pageBreak;
    firstLcInfoDetailsTemplate = firstLcInfoDetailsTemplate.replace(
      `{{headerHere}}`,
        headerTemplate.toString()
    );
  }else{
    firstLcInfoDetailsTemplate = firstLcInfoDetailsTemplate.replace(
      `{{headerHere}}`,
        ""
    );
  }
  firstLcInfoDetailsTemplate = firstLcInfoDetailsTemplate.replace(
    `{{materialLabel}}`,
      lcInfLabelTemplate || "-"
  );
  if(dataGrid.length==1){
    if(j==1){
      lcInfoDetailsTemplates+=pageBreak;
    }
    firstLcInfoDetailsTemplate = firstLcInfoDetailsTemplate.replace(
      `{{footerHere}}`,
        footerTemplate.toString() || "-"
    );
  }else{
    firstLcInfoDetailsTemplate = firstLcInfoDetailsTemplate.replace(
      `{{footerHere}}`,
        ""
    );
  }

  if((j+1) % 3 == 2){
    lcInfoDetailsTemplates+="</div>";
  }
  
  lcInfoDetailsTemplates += parseJasonIntoHtml(
    dataGrid[0],
    firstLcInfoDetailsTemplate
  );
  j++
  

  for(let i=1;i<dataGrid.length;i++){
    let thisLcInfoDetailsTemplate = lcInfoDetailsTemplate;
    if(i==dataGrid.length-1){
      thisLcInfoDetailsTemplate = thisLcInfoDetailsTemplate.replace(
        `{{footerHere}}`,
        footerTemplate.toString() || "-"
      );
    }else{
      thisLcInfoDetailsTemplate = thisLcInfoDetailsTemplate.replace(
        `{{footerHere}}`,
        ""
      );
    }
    if((j+1) % 3 == 2){
      lcInfoDetailsTemplates+="</div>";
    }
    if((j+1) % 3 == 0 ){
      lcInfoDetailsTemplates+=pageBreak;
      thisLcInfoDetailsTemplate = thisLcInfoDetailsTemplate.replace(
        `{{headerHere}}`,
        headerTemplate.toString()
      );
      thisLcInfoDetailsTemplate = thisLcInfoDetailsTemplate.replace(
        `{{materialLabel}}`,
        lcInfLabelTemplate || "-"
      );
    }else{
      thisLcInfoDetailsTemplate = thisLcInfoDetailsTemplate.replace(
        `{{headerHere}}`,
        ""
      );
      thisLcInfoDetailsTemplate = thisLcInfoDetailsTemplate.replace(
        `{{materialLabel}}`,
        ""
      );
    }
    
    lcInfoDetailsTemplates += parseJasonIntoHtml(
      dataGrid[i],
      thisLcInfoDetailsTemplate
    );
    j++;
  }
  htmlExportTemplate = htmlExportTemplate.replace(
    `{{lcinformations}}`,
    lcInfoDetailsTemplates || "-"
  );
  return htmlExportTemplate;
}

const addMaterialsDescriptions = function(dataGrid, materialsDetailsTemplate, htmlExportTemplate, 
  headerTemplate, materialLabelTemplate){
    const pageBreak = '<div class="mainContainer pageBreak">';

    let materialDescriptionTemplates = "";
    let firstDetailsTemplate = materialsDetailsTemplate;
    firstDetailsTemplate = firstDetailsTemplate.replace(
      `{{materialLabel}}`,
      materialLabelTemplate || "-"
    );
    firstDetailsTemplate = firstDetailsTemplate.replace(
      `{{headerHere}}`,
      ""
    );
    materialDescriptionTemplates += parseJasonIntoHtml(
      dataGrid[0],
      firstDetailsTemplate
    );

    for(let i=1; i<dataGrid.length; i++){
      let thisMaterialsDetailsTemplate = materialsDetailsTemplate;
      if((i+1) % 3 == 2 && dataGrid.length>2){
        materialDescriptionTemplates+="</div>";
      }
      if((i+1) % 3 == 0){
        if(dataGrid.length>2){
          materialDescriptionTemplates+=pageBreak;
        }
        thisMaterialsDetailsTemplate = thisMaterialsDetailsTemplate.replace(
          `{{headerHere}}`,
        headerTemplate.toString()
        );
        thisMaterialsDetailsTemplate = thisMaterialsDetailsTemplate.replace(
          `{{materialLabel}}`,
          materialLabelTemplate
        );
      }else{
        thisMaterialsDetailsTemplate = thisMaterialsDetailsTemplate.replace(
          `{{materialLabel}}`,
          ""
        );
        thisMaterialsDetailsTemplate = thisMaterialsDetailsTemplate.replace(
          `{{headerHere}}`,
         ""
        );
      }
      materialDescriptionTemplates += parseJasonIntoHtml(
        dataGrid[i],
        thisMaterialsDetailsTemplate
      );
    }
    htmlExportTemplate = htmlExportTemplate.replace(
      `{{materialDescriptions}}`,
      materialDescriptionTemplates || "-"
    );
    return htmlExportTemplate;
  }
module.exports = {
  parseJasonIntoHtml,
  generateMultipleMaterialsDescription,
  addFirstMaterials,
  addRemainingMaterials,
  addLcInfos,
  addMaterialsDescriptions,
};
