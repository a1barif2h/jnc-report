const { response } = require('express');
const fs = require('fs');
const dateTimeFormattor = require('../util/dateTimeFormattor');
const htmlTemplate = fs.readFileSync('./pdf_templates/commercial-operation/commercial-operation.html', 'utf8');
const pdf = require('./PdfGenerator');
const options = {format: 'A4', "orientation": "portrait"};

class CommercialOperation {
    constructor() {
    }

    async generate(body) {
        // body.routePermitIssueDate = body.hasOwnProperty("routePermitIssueDate") ? body.routePermitIssueDate : "_";
        // body.routePermitExpDate = body.hasOwnProperty("routePermitExpDate") ? body.routePermitExpDate : "_";
        // body.fitnessIssueDate = body.hasOwnProperty("fitnessIssueDate") ? body.fitnessIssueDate : "_";
        // pdf.pdfGenerator(htmlTemplate, body, res, options)
        body.formValue.proposedDateOfCo = dateTimeFormattor.getApplicationDate(body.formValue.proposedDateOfCo);
        const response = await pdf.generatePdfFromHtml(htmlTemplate, body, options);
        return response;
    }
}

module.exports = CommercialOperation;
