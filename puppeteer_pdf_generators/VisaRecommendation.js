const fs = require('fs');
const { ejsRender } = require('../util/templateEngine');
const { getCommonOptions } = require('../util/utils');
const { ejsPuppeteerPdfGenerator } = require('../pdf_generators/PdfGenerator');
const ejsUtils = require('../util/ejsUtils');

class VisaRecommendation {
  constructor() { };

  async generate(body) {
    body.formValue.utils = ejsUtils;

    const initialTemplate = fs.readFileSync('./ejs_pdf_templates/visa-recommendation/visa-recommendation.ejs', 'utf8');
    const initialHeaderTemplate = fs.readFileSync('./ejs_pdf_templates/visa-recommendation/header-template.ejs', 'utf8');

    const headerTemplate = ejsRender(initialHeaderTemplate, body);
    const generateTemplate = ejsRender(initialTemplate, body);

    const options = {
      ...getCommonOptions(body),
      headerTemplate,
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

module.exports = VisaRecommendation;