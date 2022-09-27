const fs = require('fs');
const { changeDateFormat } = require('../util/dateTimeFormattor');
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

if (process.env.NODE_ENV !== "production") {
  options.childProcessOptions = {
      env: {
          OPENSSL_CONF: '/dev/null',
      },
  }
}

class LandUsePlan {
    constructor() {
    }

    handleDateTimeFormat(formValue) {
      //DATE TIME FORMAT: 13 August 2022
      changeDateFormat(formValue, "applicationDate");
    }

    async generate(body) {
        this.handleDateTimeFormat(body.formValue)
        let htmlTemplate = fs.readFileSync('./pdf_templates/land-use-plan/land-use-plan.html', 'utf8');
        let htmlAreaTemplate = fs.readFileSync('./pdf_templates/land-use-plan/land-use-plan-area.html', 'utf8');
        htmlTemplate=htmlTemplate.replace(`{{buildingAreaSqm}}`,body.formValue.buildingInformation[0].buildingAreaSqm||"-")
        htmlTemplate=htmlTemplate.replace(`{{totalFloorAreaSqm}}`,body.formValue.buildingInformation[0].totalFloorAreaSqm||"-")
        const response = await pdf.generatePdfFromHtml(htmlTemplate, body, options);
        return response;
    }

}
module.exports = LandUsePlan;
