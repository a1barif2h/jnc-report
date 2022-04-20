const { response } = require('express');
const fs = require('fs');
const pdf = require('./PdfGenerator');
const options = {format: 'A4', "orientation": "portrait"};

const background_image = fs.readFileSync('./pdf_templates/background_image.html',"utf8");
const background_cancelled = fs.readFileSync('./pdf_templates/background_cancelled.html',"utf8");
const addDatagridInfoInLUP=require('../util/addDatagridInfoInLUP')

class LandUsePlan {
    constructor() {
    }

    async generate(body) {
        let htmlTemplate = fs.readFileSync('./pdf_templates/land-use-plan/land-use-plan.html', 'utf8');
        let htmlAreaTemplate = fs.readFileSync('./pdf_templates/land-use-plan/land-use-plan-area.html', 'utf8');
        // body.routePermitIssueDate = body.hasOwnProperty("routePermitIssueDate") ? body.routePermitIssueDate : "_";
        // body.routePermitExpDate = body.hasOwnProperty("routePermitExpDate") ? body.routePermitExpDate : "_";
        // body.fitnessIssueDate = body.hasOwnProperty("fitnessIssueDate") ? body.fitnessIssueDate : "_";
        // pdf.pdfGenerator(htmlTemplate, body, res, options)
        // htmlAreaTemplate=addDatagridInfoInLUP.insertAreaInfo(body,htmlAreaTemplate)
        htmlTemplate=htmlTemplate.replace(`{{buildingAreaSqm}}`,body.formValue.dataGrid[0].buildingAreaSqm||"-")
        htmlTemplate=htmlTemplate.replace(`{{totalFloorAreaSqm}}`,body.formValue.dataGrid[0].totalFloorAreaSqm||"-")
        // console.log("body.formValue.dataGrid[0].totalFloorAreaSqm:   "+""+body.formValue.dataGrid[0].totalFloorAreaSqm)
        const response = await pdf.generatePdfFromHtml(htmlTemplate, body, options);
        return response;
    }

}
module.exports = LandUsePlan;
