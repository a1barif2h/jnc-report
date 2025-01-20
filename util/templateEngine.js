
const { regexp } = require('express-xml-bodyparser');
var dataProcessor = require('flat');
const ejs = require('ejs')
const logger = require('./logger');
const util = require('./utils')
// const { logger } = require('./helper');
// const dataProcessor = (ob) => {
//     // The object which contains the
//     // final result
//     let result = {};
//     // loop through the object "ob"
//     for (const i in ob) {

//         // We check the type of the i using
//         // typeof() function and recursively
//         // call the function again
//         if ((typeof ob[i]) === 'object') {
//             const temp = dataProcessor(ob[i]);
//             for (const j in temp) {

//                 // Store temp in result
//                 result[i + '.' + j] = temp[j];
//             }
//         }
//         // Else store ob[i] in result directly
//         else {
//             result[i] = ob[i];
//         }
//     }
//     return result;
// };

// String.prototype.replaceAll = function(search, replacement) {
//     var target = this;
//     return target.split(search).join(replacement);
// };

const replacer = function (template, data) {
    const flattenedData = data;
    const regexp = new RegExp();
    for (var key in flattenedData) {
        template = template.replaceAll('{{' + key + '}}', ((flattenedData[key] || flattenedData[key] === 0) ? flattenedData[key] : "-"))
    }
    return template
}

const replaceOne = function (template, data) {
    const flattenedData = dataProcessor(data);

    const regexp = new RegExp();
    for (var key in flattenedData) {
        template = template.replace('{{' + key + '}}', (flattenedData[key] || "-"))
    }

    return template
}

const keyRemover = (template) => {
    let removeAbleTemplate = template;
    removeAbleTemplate = removeAbleTemplate.replace(/\{\{.*?}}/g, 'N/A');
    return removeAbleTemplate;
}

const doubleNaTextRemover = (template) => {
    let removeAbleTemplate = template;
    removeAbleTemplate = removeAbleTemplate.replaceAll("N/A N/A", 'N/A');
    return removeAbleTemplate;
}

const NaDashTextRemover = (template) => {
    let removeAbleTemplate = template;
    removeAbleTemplate = removeAbleTemplate.replaceAll("N/A -", 'N/A');
    return removeAbleTemplate;
}

const ejsRender = function (initialTemplate, reqBody) {
    console.log('-------------reqBody:',reqBody)
    let generatedTemplate = ejs.render(initialTemplate, reqBody);
    return generatedTemplate;
};

module.exports = { replacer, replaceOne, keyRemover, doubleNaTextRemover, NaDashTextRemover, ejsRender }
