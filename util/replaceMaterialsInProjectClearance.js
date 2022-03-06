const { response } = require("express");
const fs = require("fs");


const templateEngine = require("./templateEngine");
const replaceAllMaterialsValue=function(formValue, template){
    var templateMaterials=template;
    for(i=0;i<formValue.dataGrid1.length;i++){
        templateMaterials=templateEngine.replacer(templateMaterials,formValue.dataGrid1[i])
        templateMaterials=templateEngine.replacer(templateMaterials,formValue.dataGrid2[i])
        templateMaterials=templateEngine.replacer(templateMaterials,formValue.dataGrid3[i])
        templateMaterials=templateEngine.replacer(templateMaterials,formValue.dataGrid4[i])
        templateMaterials=templateEngine.replacer(templateMaterials,formValue.dataGrid5[i])
        templateMaterials=templateEngine.replacer(templateMaterials,formValue.dataGrid6[i])
        templateMaterials+="\n"
        templateMaterials+=template
    }
    return templateMaterials
}

module.exports = {replaceAllMaterialsValue};