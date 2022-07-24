
const axios = require('axios');
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

const generatePdfFromHtml = async function (htmlTemplate, json, options) {
    let html = templateEngine.replacer(htmlTemplate,json.formValue);
    html=html.replaceAll(`{{statusproposed2}}`,`{{userDesignation}}`);
    html=templateEngine.replacer(html,json.formValue);
    const buf = await new Promise((resolve, reject) => {
    
        pdf.create(html, options).toBuffer(function(err, buffer) {
            if (err) {
                console.log(err);
                return reject(err);
            }

            resolve(buffer);
        });
    });
    
    return buf;

}

const generatePdfFromHtmlForPayment = async function (htmlTemplate, data, options) {
  let html = templateEngine.replacer(htmlTemplate,data);
  html=templateEngine.replacer(html,data);
  const buf = await new Promise((resolve, reject) => {
  
      pdf.create(html, options).toBuffer(function(err, buffer) {
          if (err) {
              console.log(err);
              return reject(err);
          }

          resolve(buffer);
      });
  });
  return buf;

}



const generatePdfFromHtmlMultipleMaterialDescription = async function (htmlTemplate, options) {
  // const html = htmlTemplate;
  // const html = templateEngine.replacer(htmlTemplate, json.formValue);
  const buf = await new Promise((resolve, reject) => {
    pdf.create(htmlTemplate, options).toBuffer(function (err, buffer) {
      if (err) {
        console.log(err);
        return reject(err);
      }

      resolve(buffer);
    });
  });

  return buf;
};



module.exports = {
  pdfGenerator,
  generatePdfFromHtml,
  generatePdfFromHtmlForPayment,
  generatePdfFromHtmlMultipleMaterialDescription,
};