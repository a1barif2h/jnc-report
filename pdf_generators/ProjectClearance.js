const { response } = require('express');
const fs = require('fs');
const htmlTemplate = fs.readFileSync('./pdf_templates/project-clearance/project-clearance.html', 'utf8');
const pdf = require('./PdfGenerator');
const options = {format: 'A4', "orientation": "portrait"};
const background_image = fs.readFileSync('./pdf_templates/background_image.html',"utf8");
const background_cancelled = fs.readFileSync('./pdf_templates/background_cancelled.html',"utf8");

class ProjectClearance {
    constructor() {
    }

    async generate(body) {
        // body.routePermitIssueDate = body.hasOwnProperty("routePermitIssueDate") ? body.routePermitIssueDate : "_";
        // body.routePermitExpDate = body.hasOwnProperty("routePermitExpDate") ? body.routePermitExpDate : "_";
        // body.fitnessIssueDate = body.hasOwnProperty("fitnessIssueDate") ? body.fitnessIssueDate : "_";
        // pdf.pdfGenerator(htmlTemplate, body, res, options)
        try{
            
            let localTotal=body.domesticTotal
            let exportTotal=body.exportTotal
            localTotal=(localTotal*100)/(localTotal+exportTotal)
            exportTotal=100-localTotal
            
            htmlTemplatereplaceAll('{{exportOrientedPercentage}}', (exportTotal || "-"))
            htmlTemplatereplaceAll('{{localOrientedPercentage}}', (localTotal || "-"))
            
        }catch(exceptionVar){
            console.log(exceptionVar)
        }
        const response = await pdf.generatePdfFromHtml(htmlTemplate, body, options);
        return response;
    }

}

module.exports = ProjectClearance;
