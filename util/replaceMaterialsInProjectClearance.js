const { response } = require("express");
const fs = require("fs");


const templateEngine = require("./templateEngine");
const replaceAllMaterialsValue=function(data, template){
    template=templateEngine.replacer(template,data.formValue)
    let templateMaterials=template;
    
    /*
    for(i=0;i<data.formValue.dataGrid1.length;i++){
    
        templateMaterials=templateEngine.replacer(templateMaterials,data.formValue.dataGrid1[i])
        templateMaterials=templateEngine.replacer(templateMaterials,data.formValue.dataGrid2[i])
        templateMaterials=templateEngine.replacer(templateMaterials,data.formValue.dataGrid3[i])
        templateMaterials=templateEngine.replacer(templateMaterials,data.formValue.dataGrid4[i])
        templateMaterials=templateEngine.replacer(templateMaterials,data.formValue.dataGrid5[i])
        templateMaterials=templateEngine.replacer(templateMaterials,data.formValue.dataGrid6[i])
        if(i<data.formValue.dataGrid1.length-1){
            templateMaterials+=template
        }
    }*/
    for(i=0;i<data.formValue.dataGrid2.length;i++){
    
        templateMaterials=templateEngine.replacer(templateMaterials,data.formValue.dataGrid2[i])
        templateMaterials=templateEngine.replacer(templateMaterials,data.formValue.dataGrid3[i])
        templateMaterials=templateEngine.replacer(templateMaterials,data.formValue.dataGrid4[i])
        templateMaterials=templateEngine.replacer(templateMaterials,data.formValue.dataGrid5[i])
        templateMaterials=templateEngine.replacer(templateMaterials,data.formValue.dataGrid7[i])
        // if(i<data.formValue.dataGrid2.length-1){
        //     templateMaterials+=template
        // }
    }
    return templateMaterials
}

module.exports = {replaceAllMaterialsValue};