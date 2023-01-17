const fs = require("fs");
const pdf = require("./PdfGenerator");
const materialsDescriptionParser = require("../util/materialDescriptionParser.js");
const { changeDateFormat } = require("../util/dateTimeFormattor");
const { numberWithCommas } = require("../util/amountToWordUtil");
const logger = require("../util/logger");

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

// if (process.env.NODE_ENV !== "production") {
  options.childProcessOptions = {
      env: {
          OPENSSL_CONF: '/dev/null',
      },
  }
// }

class LocalPurchasePermit {
  constructor() {}

  handleDateTimeFormat(formValue) {
    //DATE TIME FORMAT: 13 August 2022
    changeDateFormat(formValue, "undertakingDate");
    changeDateFormat(formValue, "invoiceDate");
  }

  handleAmountThousandsSeparator(formValue) {
    formValue["hiddenUnitPrice"] = numberWithCommas(formValue["hiddenUnitPrice"]);
    formValue.PurchaseDetailsGroup.map((purchaseDetail, idx) => {
      formValue.PurchaseDetailsGroup[idx]["fobCurrencyValue"] = numberWithCommas(purchaseDetail["fobCurrencyValue"]);
    })
  }

  async generate(body) {
    this.handleDateTimeFormat(body.formValue);
    this.handleAmountThousandsSeparator(body.formValue)
    
    let htmlTemplate = fs.readFileSync(
      "./pdf_templates/local-purchase-permit/local-purchase-permit.html",
      "utf8"
    );
    let headerTemplate = fs.readFileSync(
      "./pdf_templates/local-purchase-permit/headerTemplate.html",
      "utf8"
    );
    let materialsDetailsTemplateInitial = fs.readFileSync(
      "./pdf_templates/local-purchase-permit/materialsDetails.html",
      "utf8"
    );
    let footerTemplate = fs.readFileSync(
      "./pdf_templates/local-purchase-permit/footer.html",
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

module.exports = LocalPurchasePermit;
