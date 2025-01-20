const fs = require("fs");
const logger = require("../util/logger");
const { ejsRender } = require("../util/templateEngine");
const { ejsPuppeteerPdfGenerator } = require("../pdf_generators/PdfGenerator");
const { getFormatDateWithTime } = require("../util/dateTimeFormattor");
const ejsUtils = require("../util/ejsUtils");
const { json } = require("express");
const {getCommitteeData} = require("../services/jnc/committee-details");


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

    const response = await getCommitteeData();

    console.log('response:',response)
    
    const generateTemplate = ejsRender(template, {formValue: {...body, response}});

    
    const pageStyle = `
      @page {
          margin-top: 40px;
          margin-bottom: 80px;
      }
    `;

    options.headerTemplate = '<span>hiii</span>';

    options.footerTemplate = '<span></span>';
    

    const generatedPdf = await ejsPuppeteerPdfGenerator(
      generateTemplate,
      options,
      pageStyle
    );

    console.log('============ generateTemplate:',generateTemplate)


    return generatedPdf;
  }
}

module.exports = MemberList;
