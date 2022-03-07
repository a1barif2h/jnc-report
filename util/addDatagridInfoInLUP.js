const { response } = require("express");
const fs = require("fs");


const templateEngine = require("./templateEngine");
const insertAreaInfo=function(data, template){
    template=templateEngine.replacer(template,data.formValue)
    let templateMaterials=template;
    
    for(i=0;i<data.formValue.dataGrid.length;i++){
        templateMaterials=templateEngine.replacer(templateMaterials,data.formValue.dataGrid[i])
        if(i<data.formValue.dataGrid.length-1){
            templateMaterials+=template
        }
    }
    return templateMaterials
}

module.exports = {insertAreaInfo};