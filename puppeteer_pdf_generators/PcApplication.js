const fs = require("fs");
const logger = require("../util/logger");
const { ejsRender } = require("../util/templateEngine");
const { ejsPuppeteerPdfGenerator } = require("../pdf_generators/PdfGenerator");
const { getFormatDateWithTime } = require("../util/dateTimeFormattor");
const ejsUtils = require("../util/ejsUtils");
const { json } = require("express");

const options = {
  orientation: "portrait",
  printBackground: true,
  format: "A4",
  displayHeaderFooter: true,
  childProcessOptions: {
      env: {
          OPENSSL_CONF: '/dev/null',
      },
  }
};

class PcApplication {
  constructor() {}

  async generate(body) {
    body.utils = ejsUtils;

    // logger.info("Project Clearance request body = %o", JSON.stringify(body));

    const pcApplicationTemplate = fs.readFileSync(
      "./ejs_pdf_templates/pc-application/pc-application.ejs",
      "utf8"
    );
    
    const generateTemplate = ejsRender(pcApplicationTemplate, body);

    const pageStyle = `
      @page {
          margin-top: 80px;
          margin-bottom: 80px;
      }
    `;

    options.headerTemplate = '<span></span>';

    options.footerTemplate = fs.readFileSync(
      "./ejs_pdf_templates/pc-application/footer.ejs",
      "utf8"
    );
    

    const generatedPdf = ejsPuppeteerPdfGenerator(
      generateTemplate,
      options,
      pageStyle
    );

    return generatedPdf;
  }
}

module.exports = PcApplication;
