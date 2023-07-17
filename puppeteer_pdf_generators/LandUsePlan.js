const fs = require('fs');
const { ejsRender } = require('../util/templateEngine');
const { getCommonOptions } = require('../util/utils');
const { ejsPuppeteerPdfGenerator } = require('../pdf_generators/PdfGenerator');
const ejsUtils = require('../util/ejsUtils');
const { changeDateFormat } = require('../util/dateTimeFormattor');

class LandUsePlan {
  constructor() { };

  handleDateTimeFormat(formValue) {
    //DATE TIME FORMAT: 13 August 2022
    changeDateFormat(formValue, "applicationDate");
  }

  async generate(body) {
    body.formValue.utils = ejsUtils;
    this.handleDateTimeFormat(body.formValue);

    const initialTemplate = fs.readFileSync('./ejs_pdf_templates/land-use-plan/land-use-plan.ejs', 'utf8');
    const initialHeaderTemplate = fs.readFileSync('./ejs_pdf_templates/land-use-plan/header-template.ejs', 'utf8');

    const headerTemplate = ejsRender(initialHeaderTemplate, body);
    const generateTemplate = ejsRender(initialTemplate, body);

    const options = {
      ...getCommonOptions(body),
      headerTemplate,
    };

    const pageStyle = `
      @page {
          margin-top: 100px;
          margin-bottom: 40px;
      }
    `;

    const generatedPdf = ejsPuppeteerPdfGenerator(generateTemplate, options, pageStyle);

    return generatedPdf;
  }
};

module.exports = LandUsePlan;