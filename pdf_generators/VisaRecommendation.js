const { response } = require('express');
const fs = require('fs');
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

class VisaRecommendation {
    constructor() {
    }

    async generate(body) {
        let htmlTemplate = fs.readFileSync('./pdf_templates/visa-recommendation/visa-recommendation.html', 'utf8');
        const response = await pdf.generatePdfFromHtml(htmlTemplate, body, options);
        return response;
    }
}

module.exports = VisaRecommendation;
