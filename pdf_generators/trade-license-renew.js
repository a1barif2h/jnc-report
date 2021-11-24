const { response } = require('express');
const fs = require('fs');
const dateTimeFormattor = require('../util/dateTimeFormattor');
const htmlTemplate = fs.readFileSync('./pdf_templates/trade-license-renew/trade-license-renew.html', 'utf8');
const pdf = require('./PdfGenerator');
const options = {format: 'A4', "orientation": "portrait"};

class TradeLicenseRenew {
    constructor() {
    }

    async generate(body) {
        // body.routePermitIssueDate = body.hasOwnProperty("routePermitIssueDate") ? body.routePermitIssueDate : "_";
        // body.routePermitExpDate = body.hasOwnProperty("routePermitExpDate") ? body.routePermitExpDate : "_";
        // body.fitnessIssueDate = body.hasOwnProperty("fitnessIssueDate") ? body.fitnessIssueDate : "_";
        // pdf.pdfGenerator(htmlTemplate, body, res, options)
        let authorizePositionFormatted = "";
        let isOwner=false, isMd=false, isChairman=false;
        if(body.formValue.authorizePosition.owner) {
            authorizePositionFormatted += "Owner";
            isOwner=true;
        }
        if(body.formValue.authorizePosition.manningDirector){
            if(isOwner) authorizePositionFormatted += ", ";
            authorizePositionFormatted += "Managing Director";
            isMd=true;
        }
        if(body.formValue.authorizePosition.chairmanInformation){
            if(isMd || (!isMd && isOwner)) authorizePositionFormatted += ", ";
            authorizePositionFormatted += "Chairman";
        }

        body.formValue.authorizePositionFormatted = authorizePositionFormatted;
        const response = await pdf.generatePdfFromHtml(htmlTemplate, body, options);
        return response;
    }
}

module.exports = TradeLicenseRenew;
