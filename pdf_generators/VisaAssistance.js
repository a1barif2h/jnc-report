const { response } = require('express');
const fs = require('fs');
const { logger } = require('../util/helper');
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

class VisaAssistance {
    constructor() {
    }

    async generate(body) {
        
        let htmlTemplate = fs.readFileSync('./pdf_templates/visa-assistance/visa-assistance.html', 'utf8');

        const response = await pdf.generatePdfFromHtml(htmlTemplate, body, options);
        return response;
    }
}

module.exports = VisaAssistance;
