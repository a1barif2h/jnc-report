const { response } = require('express');
const fs = require('fs');
const pdf = require('./PdfGenerator');
const options = {format: 'A4', "orientation": "portrait"};

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
