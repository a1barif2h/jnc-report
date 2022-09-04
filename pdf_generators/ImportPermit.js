const { response } = require("express");
const fs = require("fs");

const pdf = require("./PdfGenerator");
const options = {
  format: "A4",
  orientation: "portrait",
  childProcessOptions: {
    env: {
      OPENSSL_CONF: '/dev/null',
    },
  },
  footer: {
    height: '5mm',
    contents: {
      default:
        '<div id="pageFooter" style="text-align: center; font-size: 8px;">{{page}}/{{pages}}</div>',
    },
  }
};

const materialsDescriptionParser = require("../util/materialDescriptionParser.js");
const { AllSopsCodes } = require("../shared/constants/AllSopsCodes");
const logger = require("../util/logger");
const { getFormatDate } = require("../util/dateTimeFormattor");

class ImportPermit {
  constructor() { }

  changeDateFormat(formValue, key) {
    if (
      formValue &&
      formValue[key] &&
      formValue[key] !== "N/A"
    ) {
      formValue[key] = getFormatDate(formValue[key])
    }

  }

  handleDateTimeFormat(formValue) {
    //DATE TIME FORMAT: 13 August 2022
    this.changeDateFormat(formValue, "invoiceVendorRefDate");
    this.changeDateFormat(formValue, "undertakingDate");
    this.changeDateFormat(formValue, "carrierPassportValidity");

    formValue.importMaterialsInformationGroup.map((materialDetails) => {
      this.changeDateFormat(materialDetails, "hiddenCompoValueOne");
      this.changeDateFormat(materialDetails, "hiddenCompoValueTwo");
    })

    formValue.ttPOScCmLCInformationContainer.map((lcDetails) => {
      this.changeDateFormat(lcDetails, "issueDate");
    })
  }

  async generate(body) {

    this.handleDateTimeFormat(body.formValue);

    let baseHtmlTemplate = fs.readFileSync(
      "./pdf_templates/import-permit/import-permit.html",
      "utf8"
    );

    let logoQrBarCodeHeaderTemplate = fs.readFileSync(
      "./pdf_templates/import-permit/headerTemplate.html",
      "utf8"
    );
    let materialLabelTemplate = fs.readFileSync(
      "./pdf_templates/import-permit/materialDetailsLabel.html",
      "utf8"
    );

    const materialsDetailsTemplateInitial = fs.readFileSync(
      "./pdf_templates/import-permit/materialsDetails.html",
      "utf8"
    );

    const lcInfoDetailsTemplateinitial = fs.readFileSync(
      "./pdf_templates/import-permit/lcsInformationsDetails.html",
      "utf8");

    //Add logo bar code in header template
    logoQrBarCodeHeaderTemplate = materialsDescriptionParser.addJsonValuesIntoHtml(
      body.formValue,
      logoQrBarCodeHeaderTemplate
    );


    //Adding general infomation values
    let copyOfBasehtmlImportTemplate = baseHtmlTemplate;
    copyOfBasehtmlImportTemplate = materialsDescriptionParser.addJsonValuesIntoHtml(
      body.formValue,
      copyOfBasehtmlImportTemplate
    );

    //Add the logo qr bar code template in the main template
    copyOfBasehtmlImportTemplate = copyOfBasehtmlImportTemplate.replace(
      `{{headerHere}}`,
      logoQrBarCodeHeaderTemplate.toString() || "-"
    );


    let materialsDetailsTemplate = materialsDetailsTemplateInitial;

    let lcInfoDetailsTemplate = lcInfoDetailsTemplateinitial;

    const materialAndLcDescriptionsSectionGenerationProps = {
      materialInfoItems: body.formValue.importMaterialsInformationGroup,
      materialsDetailsTemplate: materialsDetailsTemplate,
      baseHtmlIEPTemplate: copyOfBasehtmlImportTemplate,
      logoQrBarCodeHeaderTemplate: logoQrBarCodeHeaderTemplate,
      materialLabelTemplate: materialLabelTemplate,
      //lc sections infos
      lcInfoItems: body.formValue.ttPOScCmLCInformationContainer,
      lcInfoDetailsTemplate: lcInfoDetailsTemplate,
      applicationCode: AllSopsCodes.IMPORT_PERMIT.value
    };

    copyOfBasehtmlImportTemplate = materialsDescriptionParser.generateFirstPage(materialAndLcDescriptionsSectionGenerationProps);

    materialAndLcDescriptionsSectionGenerationProps.baseHtmlIEPTemplate = copyOfBasehtmlImportTemplate;

    copyOfBasehtmlImportTemplate = materialsDescriptionParser.addMaterialsDescriptions(materialAndLcDescriptionsSectionGenerationProps);

    const response = await pdf.generatePdfFromHtmlMultipleMaterialDescription(
      copyOfBasehtmlImportTemplate,
      options
    );

    return response;
  }
}

module.exports = ImportPermit;
