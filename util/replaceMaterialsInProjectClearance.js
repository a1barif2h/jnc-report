const { response } = require("express");
const fs = require("fs");
const { logger } = require("./helper");


const templateEngine = require("./templateEngine");

const replaceAllMaterialsValue=function(data, template){
    template=templateEngine.replacer(template,data.formValue)
    let templateMaterials=template;
    // logger('dataGrid2', data.formValue.dataGrid2)
    // logger('productionProgramme', data.formValue.productionProgramme)
    // for(i=0;i<data.formValue.dataGrid2.length;i++){
    
    //     templateMaterials=templateEngine.replacer(templateMaterials,data.formValue.dataGrid2[i])
    //     templateMaterials=templateEngine.replacer(templateMaterials,data.formValue.dataGrid3[i])
    //     templateMaterials=templateEngine.replacer(templateMaterials,data.formValue.dataGrid4[i])
    //     templateMaterials=templateEngine.replacer(templateMaterials,data.formValue.dataGrid5[i])
    //     templateMaterials=templateEngine.replacer(templateMaterials,data.formValue.dataGrid7[i])
    // }

    for(i=0;i<data.formValue.productionProgramme.length;i++){
    
        templateMaterials=templateEngine.replacer(templateMaterials,data.formValue.productionProgramme[i])
        templateMaterials=templateEngine.replacer(templateMaterials,data.formValue.projectionOfExport[i])
        templateMaterials=templateEngine.replacer(templateMaterials,data.formValue.projectionOfDomestic[i])
        templateMaterials=templateEngine.replacer(templateMaterials,data.formValue.additionOfMachinery[i])
        templateMaterials=templateEngine.replacer(templateMaterials,data.formValue.costOfProduction[i])
    }
    return templateMaterials
}

module.exports = {replaceAllMaterialsValue};