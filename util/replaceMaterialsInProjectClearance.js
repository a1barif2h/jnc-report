const { response } = require("express");
const fs = require("fs");


const templateEngine = require("./templateEngine");
const replaceAllMaterialsValue=function(data, template){
    template=templateEngine.replacer(template,data.formValue)
    let templateMaterials=template;
    
    templateMaterials=templateEngine.replacer(templateMaterials,data.formValue.dataGrid1[0])
    templateMaterials=templateEngine.replacer(templateMaterials,data.formValue.dataGrid2[0])
    templateMaterials=templateEngine.replacer(templateMaterials,data.formValue.dataGrid3[0])
    templateMaterials=templateEngine.replacer(templateMaterials,data.formValue.dataGrid4[0])
    templateMaterials=templateEngine.replacer(templateMaterials,data.formValue.dataGrid5[0])
    templateMaterials=templateEngine.replacer(templateMaterials,data.formValue.dataGrid6[0])
    // for(i=0;i<data.formValue.dataGrid1.length;i++){
    //     templateMaterials+="\n"
    //     templateMaterials+=template
    // }
    return templateMaterials
}

module.exports = {replaceAllMaterialsValue};