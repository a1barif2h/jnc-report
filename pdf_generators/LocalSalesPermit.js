const fs = require("fs");
const logger = require("../util/logger");
const { changeDateFormat } = require("../util/dateTimeFormattor");

const pdf = require("./PdfGenerator");
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
  // logger.info(`adding childProcessOptions for creating pdf in staging`)
  options.childProcessOptions = {
    env: {
      OPENSSL_CONF: '/dev/null',
    },
  }
// }

const materialsDescriptionParser = require("../util/materialDescriptionParser.js");

class LocalSalesPermit {
  constructor() {}
  handleDateTimeFormat(formValue) {
    //DATE TIME FORMAT: 13 August 2022
    changeDateFormat(formValue, "undertakingDate");
    changeDateFormat(formValue, "invoiceVendorRefDate");
  }

  async generate(body) {
    this.handleDateTimeFormat(body.formValue)
    let htmlTemplate = fs.readFileSync(
      "./pdf_templates/local-sales-permit/local-sales-permit.html",
      "utf8"
    );
    let headerTemplate = fs.readFileSync(
      "./pdf_templates/local-sales-permit/headerTemplate.html",
      "utf8"
    );
    let materialsDetailsTemplateInitial = fs.readFileSync(
      "./pdf_templates/local-sales-permit/materialsDetails.html",
      "utf8"
    );
    let footerTemplate = fs.readFileSync(
      "./pdf_templates/local-sales-permit/footer.html",
      "utf8"
    );
    headerTemplate = materialsDescriptionParser.addJsonValuesIntoHtml(
      body.formValue,
      headerTemplate
    );
    let htmlImportTemplate = htmlTemplate;
    htmlImportTemplate = materialsDescriptionParser.addJsonValuesIntoHtml(
      body.formValue,
      htmlImportTemplate
    );
    htmlImportTemplate = htmlImportTemplate.replace(
      `{{headerHere}}`,
      headerTemplate.toString() || "-"
    );
    let materialsDetailsTemplate = materialsDetailsTemplateInitial;

    htmlImportTemplate = materialsDescriptionParser.addFirstTwoMaterialDescriptions(
      body.formValue.PurchaseDetailsGroup,
      materialsDetailsTemplate,
      htmlImportTemplate,
      "",
      footerTemplate
    )

    materialsDetailsTemplate = materialsDetailsTemplateInitial;

    htmlImportTemplate = materialsDescriptionParser.addRemainingMaterialsDescription(
      body.formValue.PurchaseDetailsGroup,
      materialsDetailsTemplate,
      htmlImportTemplate,
      "",
      headerTemplate,
      footerTemplate
    )

    const response = await pdf.generatePdfFromHtmlMultipleMaterialDescription(
      htmlImportTemplate,
      options
    );

    return response;
  }
}

module.exports = LocalSalesPermit;
