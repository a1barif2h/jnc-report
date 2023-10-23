const fs = require("fs");
const { ejsRender } = require("../util/templateEngine");
const { getCommonOptions } = require("../util/utils");
const { ejsPuppeteerPdfGenerator } = require("../pdf_generators/PdfGenerator");
const ejsUtils = require("../util/ejsUtils");
const { CARRIER_TYPE } = require("../constants/const");
const { changeDateFormat } = require("../util/dateTimeFormattor");
const { numberWithCommas } = require("../util/amountToWordUtil");
const logger = require("../util/logger");
const { getMachenariesByApplicationID } = require("../services/gateway_services/bezaServiceGateway");
const currencyConverter = require("../util/currencyConverter");

class ImportPermit {
  constructor() {}

  handleDateTimeFormat(formValue) {
    //DATE TIME FORMAT: 13 August 2022
    changeDateFormat(formValue, "applicationDate");
  }

  async getMachineries(
    applicationId,
    additionOfMachinery,
    addMachineriesByFile
  ) {
    let machineriesToCalculate = [];
    if (addMachineriesByFile) {
      //machineries have been added through excel so get the values from there
      const machineries = await getMachenariesByApplicationID(applicationId);
      machineriesToCalculate = machineries.additionOfMachinery;
    } else {
      machineriesToCalculate = additionOfMachinery;
    }
    return machineriesToCalculate;
  }

  #getCurrencyList(machineriesToCalculate) {
    const currencies = {};

    machineriesToCalculate.length > 0 &&
      machineriesToCalculate.map((machinery) => {
        const currencyName = machinery.valueCurrency;
        const currencyValue = parseFloat(machinery.valueInput);
        if (currencies[currencyName]) {
          currencies[currencyName] = currencies[currencyName] + currencyValue;
        } else {
          currencies[currencyName] = currencyValue;
        }
      });
    return currencies;
  }

  handleAmountThousandsSeparator(formValue) {
    logger.info(
      "Start converting normal to thousands separator for sop: %s",
      formValue.sopCode
    );
    formValue["dCostOfTheProjectInUs"] = numberWithCommas(
      formValue["dCostOfTheProjectInUs"]
    );

    logger.info("Converting done");
  }

  async generate(body) {
    this.handleDateTimeFormat(body.formValue);
    this.handleAmountThousandsSeparator(body.formValue);

    try {
      const machineriesToCalculate = await this.getMachineries(
        body?.id,
        body.formValue?.additionOfMachinery,
        body.formValue?.addMachineriesByFile
      );
      const currencyList = this.#getCurrencyList(machineriesToCalculate);

      body.formValue.machineriesToCalculate = machineriesToCalculate;

      const totalMachineryAmount = await currencyConverter(currencyList, "USD");
      body.formValue.machineryCurrencyValue = totalMachineryAmount.toFixed(2);
      body.formValue.machineryCurrency = "USD";
      this.handleAmountThousandsSeparator(body.formValue);
    } catch (error) {
      logger.error(error);
    }

    body.formValue.industryCategory =
      body.formValue?.industryCategory.name || "";

    body.formValue.utils = ejsUtils;

    const initialTemplate = fs.readFileSync(
      "./ejs_pdf_templates/project-registration/project-registration.ejs",
      "utf8"
    );
    const initialHeaderTemplate = fs.readFileSync(
      "./ejs_pdf_templates/project-registration/header-template.ejs",
      "utf8"
    );

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

    const generatedPdf = ejsPuppeteerPdfGenerator(
      generateTemplate,
      options,
      pageStyle
    );

    return generatedPdf;
  }
}

module.exports = ImportPermit;
