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


class Occupancy {
    constructor() {
    }

    handleDateTimeFormat(formValue) {
      //DATE TIME FORMAT: 13 August 2022
      changeDateFormat(formValue, "approvalNoOfBuildingPermitDate");
      changeDateFormat(formValue, "approvalNoOfFireFightingFloorPlanApprovalCertificateDate");
      changeDateFormat(formValue, "approvalNoOfTorForEiaDate");
      changeDateFormat(formValue, "requestDateAndTimeForInspection1");
    }

    async generate(body) {
      this.handleDateTimeFormat(body.formValue)
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
