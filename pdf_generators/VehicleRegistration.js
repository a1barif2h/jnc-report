const fs = require('fs');
const htmlTemplate = fs.readFileSync('./pdf_templates/vehicle-registration/vehicle-registration.html', 'utf8');
const pdf = require('./PdfGenerator');
const options = {format: 'A4', "orientation": "landscape"};

class VehicleRegistration {
    constructor() {
    }

    generate(res, body) {
        body.routePermitIssueDate = body.hasOwnProperty("routePermitIssueDate") ? body.routePermitIssueDate : "_";
        body.routePermitExpDate = body.hasOwnProperty("routePermitExpDate") ? body.routePermitExpDate : "_";
        body.fitnessIssueDate = body.hasOwnProperty("fitnessIssueDate") ? body.fitnessIssueDate : "_";
        pdf.pdfGenerator(htmlTemplate, body, res, options)
    }
}

module.exports = VehicleRegistration;
