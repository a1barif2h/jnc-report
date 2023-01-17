const fs = require('fs');
const dateTimeFormattor = require('../util/dateTimeFormattor');
const logger = require('../util/logger');
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

  // if(process.env.NODE_ENV !== "production") {
    logger.info(`adding childProcessOptions for creating pdf in staging`)
    options.childProcessOptions = {
      env: {
        OPENSSL_CONF: '/dev/null',
      },
    }
  // }

class CommercialOperation {
    constructor() {
    }

    handleDateTimeFormat(formValue) {
      //DATE TIME FORMAT: 13 August 2022
      dateTimeFormattor.changeDateFormat(formValue, "proposedDateOfCo");
    }

    async generate(body) {
        this.handleDateTimeFormat(body.formValue);
        const htmlTemplate = fs.readFileSync('./pdf_templates/commercial-operation/commercial-operation.html', 'utf8');
        const m = new Date();
        const myDate = m.getUTCDate() + "/" + (m.getUTCMonth()+1) + "/" + m.getUTCFullYear();
        body.formValue.commercialIssueDate = myDate;
        const response = await pdf.generatePdfFromHtml(htmlTemplate, body, options);
        return response;
    }

}

module.exports = CommercialOperation;
