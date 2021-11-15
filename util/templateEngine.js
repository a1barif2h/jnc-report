
var dataProcessor = require('flat')
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



const replacer = function (template, data) {
    const flattenedData = dataProcessor(data);

    for (var key in flattenedData) {
        // console.log("key:",key," || value:",flattenedData[key])
        //{{spouseName}}
        //dat[spouseName] = neetu
        // template= template.replace('{{spouseName}}', ("neetu" || "-"))
        template = template.replace('{{'+key+'}}', (flattenedData[key] || "-"))
    }

    return template
}

module.exports = {replacer}
