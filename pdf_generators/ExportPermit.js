const { response } = require("express");
const fs = require("fs");
const htmlTemplate = fs.readFileSync(
  "./pdf_templates/export-permit/export-permit.html",
  "utf8"
);
const pdf = require("./PdfGenerator");
const options = { format: "A4", orientation: "portrait" };
const dateTimeFormattor = require('../util/dateTimeFormattor');

class ExportPermit {
  constructor() {}

  async generate(body) {
    // body.routePermitIssueDate = body.hasOwnProperty("routePermitIssueDate") ? body.routePermitIssueDate : "_";
    // body.routePermitExpDate = body.hasOwnProperty("routePermitExpDate") ? body.routePermitExpDate : "_";
    // body.fitnessIssueDate = body.hasOwnProperty("fitnessIssueDate") ? body.fitnessIssueDate : "_";
    // pdf.pdfGenerator(htmlTemplate, body, res, options)
    body.formValue.undertakingDate = dateTimeFormattor.getApplicationDate(body.formValue.undertakingDate);
    body.formValue.invoiceVendorRefDate = dateTimeFormattor.getApplicationDate(body.formValue.invoiceVendorRefDate);

    body.formValue.dataGrid.forEach(element => {
      console.log(element);
      element.issueDate = dateTimeFormattor.getApplicationDate(element.issueDate);
      element.expiryDate = dateTimeFormattor.getApplicationDate(element.expiryDate);
    });
    const response = await pdf.generatePdfFromHtml(htmlTemplate, body, options);
    return response;
  }
}

module.exports = ExportPermit;
