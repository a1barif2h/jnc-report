const { response } = require("express");
const fs = require("fs");
const { getFormatDate } = require("../util/dateTimeFormattor");
// const { logger } = require("../util/helper");

const pdf = require('./PdfGenerator');
const options = { 
  format: "A4", 
  orientation: "portrait",
  footer: {
    height: '5mm',
    contents: {
      default:
        '<div id="pageFooter" style="text-align: center; font-size: 8px;">{{page}}/{{pages}}</div>',
    },
  }
};


class Occupancy {
    constructor() {
    }

    async generate(body) {
      // logger('occupancy body', body)
      body.formValue.plotAddress = body.formValue?.plotAddress ? body.formValue?.plotAddress : "N/A";
      let htmlTemplate = fs.readFileSync(
        "./pdf_templates/occupancy/occupancy.html",
        "utf8"
      );
        const response = await pdf.generatePdfFromHtml(htmlTemplate, body, options);
        return response;
  }
}
module.exports = Occupancy;
