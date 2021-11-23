const { response } = require("express");
const fs = require("fs");
const htmlTemplate = fs.readFileSync(
  "./pdf_templates/export-permit/export-permit.html",
  "utf8"
);
const multipageHeader =fs.readFileSync(
  "./pdf_templates/export-permit/export-multipage-header.html"
);

const materialGroup =fs.readFileSync(
  "./pdf_templates/export-permit/export-material-group.html"
);

const htmlFooter = fs.readFileSync(
  "./pdf_templates/export-permit/export-permit-footer.html"
);

const pdf = require("./PdfGenerator");
const options = { format: "A4", orientation: "portrait" };
const dateTimeFormattor = require('../util/dateTimeFormattor');
const templateEngine = require('../util/templateEngine');

class ExportPermit {
  constructor() {}

  async generate(body) {
    // body.routePermitIssueDate = body.hasOwnProperty("routePermitIssueDate") ? body.routePermitIssueDate : "_";
    // body.routePermitExpDate = body.hasOwnProperty("routePermitExpDate") ? body.routePermitExpDate : "_";
    // body.fitnessIssueDate = body.hasOwnProperty("fitnessIssueDate") ? body.fitnessIssueDate : "_";
    // pdf.pdfGenerator(htmlTemplate, body, res, options)
    body.formValue.undertakingDate = dateTimeFormattor.getApplicationDate(body.formValue.undertakingDate);
    body.formValue.invoiceVendorRefDate = dateTimeFormattor.getApplicationDate(body.formValue.invoiceVendorRefDate);

    body.formValue.dataGrid.forEach((element, index) => {
      let html = htmlTemplate;
      console.log(index);
      // console.log(element);
      element.issueDate = dateTimeFormattor.getApplicationDate(element.issueDate);
      element.expiryDate = dateTimeFormattor.getApplicationDate(element.expiryDate);
      if(index==0){
        element.firstMaterial = multipageHeader;
        templateEngine.replacer(multipageHeader, element);
      }
      if(body.formValue.dataGrid.length < 1){
        
      }
      if(index%2!=0){
        html+="<div class=\"mainContainer pagebreak\">";
        html+=multipageHeader;
      }
    });

    html += "</main></div>";
    console.log(html);
    const response = await pdf.generatePdfFromHtml(html, body, options);
    return response;
  }
}

module.exports = ExportPermit;
