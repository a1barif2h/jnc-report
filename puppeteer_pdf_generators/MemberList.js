const fs = require("fs");
const logger = require("../util/logger");
const { ejsRender } = require("../util/templateEngine");
const { ejsPuppeteerPdfGenerator } = require("../pdf_generators/PdfGenerator");
const { getFormatDateWithTime } = require("../util/dateTimeFormattor");
const ejsUtils = require("../util/ejsUtils");
const { json } = require("express");
const {getCommitteeData} = require("../services/jnc/committee-details");
const {downloadAndConvertImage} = require("../util/downloadImageAndConvertInBase64");


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
    );body

    const { committeeId } = body;
    console.log({committeeId})

    const response = await getCommitteeData(committeeId);


    /** this code is required when we implement the 'signature' */
    /*
    for (let i = 0; i < response?.recommends?.length; i++) {
      const element = response?.recommends[i];
      const data = await downloadAndConvertImage(element?.signature);
      element["signature64"] = data;
    }

    for (let i = 0; i < response?.approvers?.length; i++) {
      const element = response?.approvers[i];
      const data = await downloadAndConvertImage(element?.signature);
      element["signature64"] = data;
    }

    */

    // const {signature64, ...restRes} = response

    
    response.date = ejsUtils.convertDateInBangla(response.date) || response?.date;
    console.log('response:',response);

    
    const generateTemplate = ejsRender(template, {formValue: {...body, response}});

    
    const pageStyle = `
      @page {
          margin-top: 10px;
      }
    `;

    options.headerTemplate = '<span>hiii</span>';

    options.footerTemplate = '<span></span>';
    

    const generatedPdf = await ejsPuppeteerPdfGenerator(
      generateTemplate,
      options,
      pageStyle
    );

    return generatedPdf;
  }
}

module.exports = MemberList;
