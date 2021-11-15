const { response } = require('express');
const fs = require('fs');
const htmlTemplate = fs.readFileSync('./pdf_templates/project-clearance/project-clearance.html', 'utf8');
const pdf = require('./PdfGenerator');
const options = {format: 'A4', "orientation": "portrait"};

class ProjectClearance {
    constructor() {
    }

    async generate(res, body) {
        // body.routePermitIssueDate = body.hasOwnProperty("routePermitIssueDate") ? body.routePermitIssueDate : "_";
        // body.routePermitExpDate = body.hasOwnProperty("routePermitExpDate") ? body.routePermitExpDate : "_";
        // body.fitnessIssueDate = body.hasOwnProperty("fitnessIssueDate") ? body.fitnessIssueDate : "_";
        // pdf.pdfGenerator(htmlTemplate, body, res, options)
        const response = await pdf.generatePdfFromHtml(htmlTemplate, body, res, options);
        console.log(response);
    }
}

module.exports = ProjectClearance;
