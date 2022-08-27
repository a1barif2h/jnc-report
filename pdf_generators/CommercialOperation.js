const { response } = require('express');
const fs = require('fs');
const dateTimeFormattor = require('../util/dateTimeFormattor');
const pdf = require('./PdfGenerator');
const options = { 
    format: "A4", 
    orientation: "portrait",
    footer: {
      height: '5mm',
      contents: {
        default:
          '<div id="pageFooter" style="text-align: center; font-size: 8px;">{{page}}/{{pages}}</div>',
      },
    }
  };

const background_image = fs.readFileSync('./pdf_templates/background_image.html',"utf8");
const background_cancelled = fs.readFileSync('./pdf_templates/background_cancelled.html',"utf8");

class CommercialOperation {
    constructor() {
    }

    async generate(body) {
        const htmlTemplate = fs.readFileSync('./pdf_templates/commercial-operation/commercial-operation.html', 'utf8');
        const m = new Date();
        const myDate = m.getUTCDate() + "/" + (m.getUTCMonth()+1) + "/" + m.getUTCFullYear();
        body.formValue.commercialIssueDate = myDate;
        body.formValue.proposedDateOfCo = dateTimeFormattor.getApplicationDate(body.formValue.proposedDateOfCo);
        const response = await pdf.generatePdfFromHtml(htmlTemplate, body, options);
        return response;
    }

}

module.exports = CommercialOperation;
