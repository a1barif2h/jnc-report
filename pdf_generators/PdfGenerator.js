
const axios = require('axios');
const config = require("../config/config");
const pdf = require('html-pdf');
const templateEngine = require('../util/templateEngine');
const { Readable } = require('stream');
const FormData = require('form-data');
// const upload = requ

const pdfGenerator = function (htmlTemplate,json,res,options){
    const html = templateEngine.replacer(htmlTemplate,json)
    pdf.create(html, options).toStream(function(err, stream) {
        if (err) return console.log(err);
        stream.pipe(res);
    });
}

const generatePdfFromHtml = async function (html, body, res, options) {
    const buf = await new Promise((resolve, reject) => {
    
        pdf.create(html, options).toBuffer(function(err, buffer) {
            if (err) {
                console.log(err);
                return reject(err);
            }
            resolve(buffer);
        });
    });
    
    
    // pdf.create(html, options).toBuffer(function(err, buffer) {
    //     if (err) {
    //         return console.log(err);
    //     }
       
    //     formData = {
    //         file: {
    //             value: Readable.from(buffer.toString()),
    //             options: {
    //                 filename: 'pdf_file.pdf',
    //                 contentType: "application/pdf"
    //              }
    //         }
    //     }
    //     let form = new FormData();
    //     form.append('file', buffer, 'pdf_file.pdf');
    //     axios
    //     .post(
    //       config.backendApi.bezaServiceBaseUrl +
    //         ":" +
    //         config.backendApi.bezaServicePort +
    //         config.backendApi.mayanCertificateUploadPath,
    //         form,
    //         {
    //             headers: {
    //                 'Content-Type': `multipart/form-data; boundary=${form._boundary}`
    //             }
    //         }
    //     )
    //     .then((response) => {
    //       // console.log(response.data);
    //       // console.log(response.data.explanation);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    //     return buffer;
    // });

    return buf;

}

module.exports = {pdfGenerator, generatePdfFromHtml}