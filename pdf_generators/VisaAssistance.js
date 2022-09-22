const fs = require('fs');
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

  if (process.env.NODE_ENV === "staging") {
    options.childProcessOptions = {
        env: {
            OPENSSL_CONF: '/dev/null',
        },
    }
  }

class VisaAssistance {
    constructor() {
    }

    async generate(body) {
        
        let htmlTemplate = fs.readFileSync('./pdf_templates/visa-assistance/visa-assistance.html', 'utf8');

        const response = await pdf.generatePdfFromHtml(htmlTemplate, body, options);
        return response;
    }
}

module.exports = VisaAssistance;
