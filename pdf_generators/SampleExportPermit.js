const fs = require("fs");
const pdf = require("./PdfGenerator");
const materialsDescriptionParser = require("../util/materialDescriptionParser.js");
const { changeDateFormat } = require("../util/dateTimeFormattor");
const { numberWithCommas } = require("../util/amountToWordUtil");

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

class SampleExportPermit {
  constructor() {}

  handleDateTimeFormat(formValue) {
    //DATE TIME FORMAT: 13 August 2022
    changeDateFormat(formValue, "expiredDate");
    changeDateFormat(formValue, "issueDate");
    changeDateFormat(formValue, "invoiceDate");
  }

  handleAmountThousandsSeparator(formValue) {
    formValue.productDetails.map((productInfo, idx) => {
      formValue.productDetails[idx]["sampleValue"] = numberWithCommas(productInfo["sampleValue"]);
    })
  }

  async generate(body) {

    // body.formValue.expiredDate = body.formValue.expiredDate !== "N/A" ? dateTimeFormattor.getFormatDate(body.formValue.expiredDate): body.formValue.expiredDate;
    this.handleDateTimeFormat(body.formValue);
    this.handleAmountThousandsSeparator(body.formValue)
    let htmlTemplate = fs.readFileSync(
      "./pdf_templates/sample-export-permit/sample-export-permit.html",
      "utf8"
    );
    let headerTemplate = fs.readFileSync(
      "./pdf_templates/sample-export-permit/sample-export-multipage-header.html",
      "utf8"
    );

    let materialsDetailsLabel = fs.readFileSync(
      "./pdf_templates/sample-export-permit/sample-export-permit-material_label.html",
      "utf8"
    );
    
    let materialsDetailsTemplateInitial = fs.readFileSync(
      "./pdf_templates/sample-export-permit/sample-export-material-group.html",
      "utf8"
    );
    
    let footerTemplate = fs.readFileSync(
      "./pdf_templates/sample-export-permit/sample-export-permit-footer.html",
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
    
    // htmlImportTemplate = materialsDescriptionParser.addFirstMaterials(
    //   body.formValue.productDetails,
    //   materialsDetailsTemplate,
    //   htmlImportTemplate,
    //   headerTemplate
    // );
    htmlImportTemplate = materialsDescriptionParser.addFirstTwoMaterialDescriptions(
      body.formValue.productDetails,
      materialsDetailsTemplate,
      htmlImportTemplate,
      materialsDetailsLabel,
      footerTemplate
    );
    materialsDetailsTemplate = materialsDetailsTemplateInitial;
    htmlImportTemplate = materialsDescriptionParser.addRemainingMaterialsDescription(
      body.formValue.productDetails,
      materialsDetailsTemplate,
      htmlImportTemplate,
      materialsDetailsLabel,
      headerTemplate,
      footerTemplate
    );
    // htmlImportTemplate = materialsDescriptionParser.addRemainingMaterials(
    //   body.formValue.productDetails,
    //   materialsDetailsTemplate,
    //   htmlImportTemplate,
    //   headerTemplate
    // );
    const response = await pdf.generatePdfFromHtmlMultipleMaterialDescription(
      htmlImportTemplate,
      options
    );

    return response;
  }

  
}

module.exports = SampleExportPermit;
