const { response } = require("express");
const fs = require("fs");
const { getFormatDate } = require("../util/dateTimeFormattor");
const { logger } = require("../util/helper");

const pdf = require('./PdfGenerator');
const options = {format: 'A4', "orientation": "portrait"};
const background_image = fs.readFileSync('./pdf_templates/background_image.html',"utf8");
const background_cancelled = fs.readFileSync('./pdf_templates/background_cancelled.html',"utf8");


class Occupancy {
    constructor() {
    }

    async generate(body) {
      logger('occupancy body', body)
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
