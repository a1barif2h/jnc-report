const { response } = require('express');
const fs = require('fs');
const { logger } = require('../util/helper');
const pdf = require('./PdfGenerator');
const options = {format: 'A4', "orientation": "portrait"};

const background_image = fs.readFileSync('./pdf_templates/background_image.html',"utf8");
const background_cancelled = fs.readFileSync('./pdf_templates/background_cancelled.html',"utf8");

class VisaAssistance {
    constructor() {
    }

    async generate(body) {
        
        let htmlTemplate = fs.readFileSync('./pdf_templates/visa-assistance/visa-assistance.html', 'utf8');
        // body.routePermitIssueDate = body.hasOwnProperty("routePermitIssueDate") ? body.routePermitIssueDate : "_";
        // body.routePermitExpDate = body.hasOwnProperty("routePermitExpDate") ? body.routePermitExpDate : "_";
        // body.fitnessIssueDate = body.hasOwnProperty("fitnessIssueDate") ? body.fitnessIssueDate : "_";
        // pdf.pdfGenerator(htmlTemplate, body, res, options)
        const response = await pdf.generatePdfFromHtml(htmlTemplate, body, options);
        return response;
    }
}

module.exports = VisaAssistance;
