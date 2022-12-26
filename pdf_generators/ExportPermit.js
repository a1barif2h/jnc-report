const fs = require("fs");

const pdf = require("./PdfGenerator");

const { changeDateFormat } = require("../util/dateTimeFormattor");

const materialsDescriptionParser = require("../util/materialDescriptionParser.js");
const { AllSopsCodes } = require("../shared/constants/AllSopsCodes");
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

// if(process.env.NODE_ENV !== "production") {
  logger.info(`adding childProcessOptions for creating pdf in staging`)
  options.childProcessOptions = {
    env: {
      OPENSSL_CONF: '/dev/null',
    },
  }
// }

class ExportPermit {
  constructor() {}

  handleDateTimeFormat(formValue) {
    //DATE TIME FORMAT: 13 August 2022
    changeDateFormat(formValue, "invoiceVendorRefDate");
    changeDateFormat(formValue, "undertakingNo1");
    changeDateFormat(formValue, "carrierPassportValidity");

    formValue.ttPOScCmLCInformationContainer.map((lcDetails) => {
      changeDateFormat(lcDetails, "issueDate");
      changeDateFormat(lcDetails, "expiryDate");
    })
  }

  async generate(body) {
    this.handleDateTimeFormat(body.formValue)

    let baseHtmlTemplate = fs.readFileSync(
      "./pdf_templates/export-permit/export-permit.html",
      "utf8"
    );
    let logoQrBarCodeHeaderTemplate = fs.readFileSync(
      "./pdf_templates/export-permit/export-multipage-header.html",
      "utf8"
    );
    
    let materialsDetailsTemplateInitial = fs.readFileSync(
      "./pdf_templates/export-permit/export-material-group.html",
      "utf8"
    );
    
    let materialLabelTemplate = fs.readFileSync(
      "./pdf_templates/export-permit/materialDetailsLabel.html",
      "utf8"
    );

    const lcInfoDetailsTemplateinitial = fs.readFileSync(
      "./pdf_templates/export-permit/lcsInformationsDetails.html",
      "utf8");
    
    logoQrBarCodeHeaderTemplate = materialsDescriptionParser.addJsonValuesIntoHtml(
      body.formValue,
      logoQrBarCodeHeaderTemplate
    );
    
    let copyOfBasehtmlImportTemplate = baseHtmlTemplate;
    
    //add general info section
    copyOfBasehtmlImportTemplate = materialsDescriptionParser.addJsonValuesIntoHtml(
      body.formValue,
      copyOfBasehtmlImportTemplate
    );

    copyOfBasehtmlImportTemplate = copyOfBasehtmlImportTemplate.replace(
      `{{headerHere}}`,
      logoQrBarCodeHeaderTemplate.toString() || "-"
    );
    
    let materialsDetailsTemplate = materialsDetailsTemplateInitial;

    let lcInfoDetailsTemplate = lcInfoDetailsTemplateinitial;

    const materialAndLcDescriptionsSectionGenerationProps = {
      materialInfoItems: body.formValue.exportMaterialsInformationGroup,
      materialsDetailsTemplate: materialsDetailsTemplate,
      baseHtmlIEPTemplate: copyOfBasehtmlImportTemplate,
      logoQrBarCodeHeaderTemplate: logoQrBarCodeHeaderTemplate,
      materialLabelTemplate: materialLabelTemplate,
      //lc sections infos
      lcInfoItems: body.formValue.ttPOScCmLCInformationContainer,
      lcInfoDetailsTemplate: lcInfoDetailsTemplate,
      applicationCode: AllSopsCodes.EXPORT_PERMIT.value
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

module.exports = ExportPermit;
