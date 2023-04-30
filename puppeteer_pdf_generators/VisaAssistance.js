const fs = require('fs');
const { ejsRender } = require('../util/templateEngine');
const { getCommonOptions } = require('../util/utils');
const { ejsPuppeteerPdfGenerator } = require('../pdf_generators/PdfGenerator');
const ejsUtils = require('../util/ejsUtils');

class VisaAssistance {
  constructor() { };

  async generate(body) {
    body.formValue.utils = ejsUtils;

    const initialTemplate = fs.readFileSync('./ejs_pdf_templates/visa-assistance/visa-assistance.ejs', 'utf8');
    const initialHeaderTemplate = fs.readFileSync('./ejs_pdf_templates/visa-assistance/header-template.ejs', 'utf8');

    const headerTemplate = ejsRender(initialHeaderTemplate, body);
    const generateTemplate = ejsRender(initialTemplate, body);

    const options = {
      ...getCommonOptions(body),
      headerTemplate,
      footerTemplate: `
      <div style="width: 100%;box-sizing: border-box;padding: 0px;text-align: right;padding-right: 10px;font-size: 8px;color: black;">
        <span class="pageNumber"></span> of <span class="totalPages"></span>
      </div>
      `,
    };

    const pageStyle = `
      @page {
          margin-top: 150px;
          margin-bottom: 40px;
      }
    `;

    const generatedPdf = ejsPuppeteerPdfGenerator(generateTemplate, options, pageStyle);

    return generatedPdf;
  }
};

module.exports = VisaAssistance;