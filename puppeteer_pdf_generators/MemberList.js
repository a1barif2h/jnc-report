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

class MemberList {
  constructor() {}

  async generate(body) {
    body.utils = ejsUtils;

    const template = fs.readFileSync(
      "./ejs_pdf_templates/member-list/member-list.ejs",
      "utf8"
    );
    
    const generateTemplate = ejsRender(template, {formValue: body});

    const pageStyle = `
      @page {
          margin-top: 40px;
          margin-bottom: 80px;
      }
    `;

    options.headerTemplate = '<span></span>';

    options.footerTemplate = '<span></span>';
    

    const generatedPdf = ejsPuppeteerPdfGenerator(
      generateTemplate,
      options,
      pageStyle
    );

    return generatedPdf;
  }
}

module.exports = MemberList;
