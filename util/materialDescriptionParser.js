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

const addJsonValuesIntoHtml = function (json, template) {
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
    materialsDescriptionTemplate += addJsonValuesIntoHtml(
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
  let firstMaterialsDetails = addJsonValuesIntoHtml(
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

const addLcInfos = function(dataGrid, lcInfoDetailsTemplate, htmlExportTemplate, headerTemplate, lcInfLabelTemplate ,materialsLength, materialLabelTemplate){
  let j = materialsLength;
  let alreadyAdded = 0;
  if(j>2){
    if((j+1) % 3 ==1){
      alreadyAdded = 2;
    }else if((j+1) % 3 ==2){
      alreadyAdded = 1;
    }
  }
  

  let lcInfoDetailsTemplates = "";
  const pageBreak = '<div class="mainContainer pageBreak">';

  let insertElementCount=0;
  for(let i=alreadyAdded;i<dataGrid.length && dataGrid.length>alreadyAdded;i++){
    let thisLcInfoDetailsTemplate = lcInfoDetailsTemplate;
    if(i==dataGrid.length-1){
      thisLcInfoDetailsTemplate = thisLcInfoDetailsTemplate.replace(
        `{{footerHere}}`,
        footerTemplate.toString() || ""
      );
    }else{
      thisLcInfoDetailsTemplate = thisLcInfoDetailsTemplate.replace(
        `{{footerHere}}`,
        ""
      );
    }
    if(insertElementCount % 3 == 0 || insertElementCount==0){
      lcInfoDetailsTemplates+=pageBreak;
      thisLcInfoDetailsTemplate = thisLcInfoDetailsTemplate.replace(
        `{{headerHere}}`,
        headerTemplate.toString()
      );
      thisLcInfoDetailsTemplate = thisLcInfoDetailsTemplate.replace(
        `{{materialLabel}}`,
        materialLabelTemplate || ""
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
    
    lcInfoDetailsTemplates += addJsonValuesIntoHtml(
      dataGrid[i],
      thisLcInfoDetailsTemplate
    );
    if(insertElementCount % 3 == 2){
      lcInfoDetailsTemplates+="</div>";
    }
    insertElementCount++;
  }
  htmlExportTemplate = htmlExportTemplate.replace(
    `{{lcinformations}}`,
    lcInfoDetailsTemplates || ""
  );
  return htmlExportTemplate;
}

const addMaterialsDescriptions = function(dataGrid, materialsDetailsTemplate, htmlExportTemplate, 
  headerTemplate, materialLabelTemplate, lcDataGrid, lcInfoDetailsTemplate){
    const pageBreak = '<div class="mainContainer pageBreak">';

    let materialDescriptionTemplates = "";
    let i;
    for( i=2; i<dataGrid.length; i++){
      let thisMaterialsDetailsTemplate = materialsDetailsTemplate;
      if((i+1) % 3 == 0){
        materialDescriptionTemplates+=pageBreak;
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
      materialDescriptionTemplates += addJsonValuesIntoHtml(
        dataGrid[i],
        thisMaterialsDetailsTemplate
      );
      if((i+1) % 3 == 2 ){
        materialDescriptionTemplates+="</div>";
      }
    }

    if(dataGrid.length>2){
      let remainsToAdd = 0;
      if((i+1) % 3 ==1){
        remainsToAdd = 2;
      }else if((i+1) % 3 ==2){
        remainsToAdd = 1;
      }
      if(remainsToAdd>0){
        let lcTemplate = lcInfoDetailsTemplate;
        lcTemplate = lcTemplate.replace(
          `{{headerHere}}`,
          ""
        );
        lcTemplate = lcTemplate.replace(
          `{{materialLabel}}`,
          // lcInfLabelTemplate || ""
          ""
        );
        if(lcDataGrid.length==1){
          lcTemplate = lcTemplate.replace(
            `{{footerHere}}`,
            footerTemplate.toString() || ""
          );
        }else{
          lcTemplate = lcTemplate.replace(
            `{{footerHere}}`,
            ""
          );
        }
        materialDescriptionTemplates += addJsonValuesIntoHtml(
          lcDataGrid[0],
          lcTemplate
        );

        if(remainsToAdd==2 && lcDataGrid.length>1){
          let lcTemplate = lcInfoDetailsTemplate;
        lcTemplate = lcTemplate.replace(
          `{{headerHere}}`,
          ""
        );
        lcTemplate = lcTemplate.replace(
          `{{materialLabel}}`,
          ""
        );
        if(lcDataGrid.length==2){
          lcTemplate = lcTemplate.replace(
            `{{footerHere}}`,
            footerTemplate.toString() || ""
          );
        }else{
          lcTemplate = lcTemplate.replace(
            `{{footerHere}}`,
            ""
          );
        }
        materialDescriptionTemplates += addJsonValuesIntoHtml(
          lcDataGrid[1],
          lcTemplate
        );
        }


      }
      materialDescriptionTemplates+="</div>";

    }


    htmlExportTemplate = htmlExportTemplate.replace(
      `{{remainingMaterialDescriptions}}`,
      materialDescriptionTemplates || ""
    );
    return htmlExportTemplate;
  }

  const addFirstTwoMaterialDescriptions = function(dataGrid, materialsDetailsTemplate, htmlExportTemplate, 
    headerTemplate, materialLabelTemplate){
      let materialDescriptionTemplates = "";
      for(let i=0;i<dataGrid.length && i<2;i++){
        let firstDetailsTemplate = materialsDetailsTemplate;
        if(i==0){
          firstDetailsTemplate = firstDetailsTemplate.replace(
            `{{materialLabel}}`,
            materialLabelTemplate || ""
          );
        }else{
          firstDetailsTemplate = firstDetailsTemplate.replace(
            `{{materialLabel}}`,
            ""
          );
        }
        firstDetailsTemplate = firstDetailsTemplate.replace(
          `{{headerHere}}`,
          ""
        );
        materialDescriptionTemplates += addJsonValuesIntoHtml(
          dataGrid[i],
          firstDetailsTemplate
        );
      }
      htmlExportTemplate = htmlExportTemplate.replace(
        `{{materialDescriptions}}`,
        materialDescriptionTemplates || ""
      );
      return htmlExportTemplate;
    }
module.exports = {
  addJsonValuesIntoHtml: addJsonValuesIntoHtml,
  generateMultipleMaterialsDescription,
  addFirstMaterials,
  addRemainingMaterials,
  addLcInfos,
  addMaterialsDescriptions,
  addFirstTwoMaterialDescriptions
};
