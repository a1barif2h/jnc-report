const fs = require("fs");
const { changeDateFormat } = require("../util/dateTimeFormattor");
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

// if (process.env.NODE_ENV !== "production") {
  options.childProcessOptions = {
      env: {
          OPENSSL_CONF: '/dev/null',
      },
  }
// }


class PartialUseOfBuilding {
    constructor() {
    }

    handleDateTimeFormat(formValue) {
      //DATE TIME FORMAT: 13 August 2022
      changeDateFormat(formValue, "prriodOfPartialUseForm");
      changeDateFormat(formValue, "periodOfPartialUseTo");
    }

    async generate(body) {
      this.handleDateTimeFormat(body.formValue)
      let htmlTemplate = fs.readFileSync(
        "./pdf_templates/partial-use-of-building/partial-use-of-building.html",
        "utf8"
      );
        const response = await pdf.generatePdfFromHtml(htmlTemplate, body, options);
        return response;
  }
}
module.exports = PartialUseOfBuilding;
