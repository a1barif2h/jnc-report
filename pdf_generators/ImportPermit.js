const { response } = require("express");
const fs = require("fs");
const materialsDescriptionParser = require("../util/materialDescriptionParser.js");
const { AllSopsCodes } = require("../shared/constants/AllSopsCodes");
const logger = require("../util/logger");
const { changeDateFormat } = require("../util/dateTimeFormattor");

const pdf = require("./PdfGenerator");
const { CARRIER_TYPE } = require("../constants/const.js");
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

if (process.env.NODE_ENV !== "production") {
  logger.info(`adding childProcessOptions for creating pdf in staging`)
  options.childProcessOptions = {
    env: {
      OPENSSL_CONF: '/dev/null',
    },
  }
}



class ImportPermit {
  constructor() { }

  handleArrivalAndDepartureValueBasedOnCarrierType(formValue, materialDetail) {
    const carrierType = formValue.carrierType;
    const naString = "N/A";

    let hiddenCompoValueOne = naString, hiddenCompoValueTwo = naString;

    switch (carrierType) {
      case CARRIER_TYPE.byAir:
        const flightNumber = formValue.flightNumber;
        hiddenCompoValueOne = flightNumber || naString;
        hiddenCompoValueTwo = new Date(formValue.flightDate);
        break;

      case CARRIER_TYPE.bySea:
        hiddenCompoValueOne = new Date(formValue.arrivalDateSea);
        hiddenCompoValueTwo = new Date(formValue.departureDateSea);
        break;

      case CARRIER_TYPE.byRoad:
        hiddenCompoValueOne = new Date(formValue.arrivalDateRoad);
        hiddenCompoValueTwo = new Date(formValue.departureDateRoad);
        break;
      default:
        break;
    }

    hiddenCompoValueOne = (carrierType === CARRIER_TYPE.byAir) ? hiddenCompoValueOne
                          : (!isNaN(hiddenCompoValueOne) ? hiddenCompoValueOne.toLocaleDateString() : naString);

    hiddenCompoValueTwo = !isNaN(hiddenCompoValueTwo) ? hiddenCompoValueTwo.toLocaleDateString() : naString
    materialDetail["hiddenCompoValueOne"] = hiddenCompoValueOne;
    materialDetail["hiddenCompoValueTwo"] = hiddenCompoValueTwo;
  }



  handleDateTimeFormat(formValue) {
    //DATE TIME FORMAT: 13 August 2022
    changeDateFormat(formValue, "invoiceVendorRefDate");
    changeDateFormat(formValue, "undertakingDate");
    changeDateFormat(formValue, "carrierPassportValidity");



    formValue.importMaterialsInformationGroup.map((materialDetail) => {
      this.handleArrivalAndDepartureValueBasedOnCarrierType(formValue, materialDetail);
      materialDetail.hiddenCompoLabelOne !== "Flight No. :" && changeDateFormat(materialDetail, "hiddenCompoValueOne");
      changeDateFormat(materialDetail, "hiddenCompoValueTwo");
    })

    formValue.ttPOScCmLCInformationContainer.map((lcDetails) => {
      changeDateFormat(lcDetails, "issueDate");
      changeDateFormat(lcDetails, "expireDate");
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
