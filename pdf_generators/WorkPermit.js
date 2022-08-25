const { response } = require("express");
const fs = require("fs");
const { logger } = require("../util/helper");
const { keyRemover, replacer } = require("../util/templateEngine");

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


class WorkPermit {
    constructor() {
    }

    async generate(body) {
        let htmlTemplate = fs.readFileSync(
          "./pdf_templates/work-permit/work-permit.html",
          "utf8"
        );
        let remunarationBoxHtmlTemplate = fs.readFileSync("./pdf_templates/work-permit/remunaration-box.html", "utf8")
        remunarationBoxHtmlTemplate = replacer(remunarationBoxHtmlTemplate, body.formValue);
        if (body.formValue.typeOfVisaObtainedForTheIncumbentForeignNationals !== "E - Employment Visa") {
          remunarationBoxHtmlTemplate = keyRemover(remunarationBoxHtmlTemplate);
        }
        body.formValue.remunarationBox = remunarationBoxHtmlTemplate;
        
        const response = await pdf.generatePdfFromHtml(htmlTemplate, body, options);
        return response;
  }
}
module.exports = WorkPermit;
