const { response } = require("express");
const fs = require("fs");
const puppeteer = require('puppeteer');

const replaceMaterialsInProjectClearance = require("../util/replaceMaterialsInProjectClearance");
const currencyConverter = require("../util/currencyConverter");
const logger = require("../util/logger");
const { changeDateFormat } = require("../util/dateTimeFormattor");
const { getMachenariesByApplicationID } = require("../services/gateway_services/bezaServiceGateway");
const { MachineriesConstants } = require("../constants/MachineriesConstants");
const { numberWithCommas } = require("../util/amountToWordUtil");
const { ejsRender } = require("../util/templateEngine");
const { ejsPuppeteerPdfGenerator } = require("../pdf_generators/PdfGenerator");
const ejsUtils = require('../util/ejsUtils');
const { getCommonOptions } = require("../util/utils");


class ProjectClearance {
  constructor() { }

  handleDateTimeFormat(formValue) {
    //DATE TIME FORMAT: 13 August 2022
    changeDateFormat(formValue, "applicationDate");
  }

  async getMachineries(applicationId, additionOfMachinery, addMachineriesByFile) {
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

    machineriesToCalculate.length > 0 && machineriesToCalculate.map((machinery) => {
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
    formValue["machineryCurrencyValue"] = numberWithCommas(formValue["machineryCurrencyValue"])
    formValue["dCostOfTheProjectInUs"] = numberWithCommas(formValue["dCostOfTheProjectInUs"])
  }

  async generate(body) {
    // ADD UTILS FUNCTION IN THE FORM VALUE
    body.formValue.utils = ejsUtils;

    this.handleAmountThousandsSeparator(body.formValue);
    this.handleDateTimeFormat(body.formValue);

    try {
      const machineriesToCalculate = await this.getMachineries(body?.id, body.formValue?.additionOfMachinery, body.formValue?.addMachineriesByFile);
      const currencyList = this.#getCurrencyList(machineriesToCalculate);
      
      body.formValue.machineriesToCalculate = machineriesToCalculate;

      const totalMachineryAmount = await currencyConverter(currencyList, "USD");
      body.formValue.machineryCurrencyValue = totalMachineryAmount.toFixed(2);
      body.formValue.machineryCurrency = "USD";
      this.handleAmountThousandsSeparator(body.formValue)
    } catch (error) {
      logger.error(error);
    }

    const initialTemplate = fs.readFileSync('./ejs_pdf_templates/project-clearance/project-clearance.ejs', 'utf-8');
    const initialHeaderTemplate = fs.readFileSync('./ejs_pdf_templates/project-clearance/header-template.ejs', 'utf-8');


    const pageStyle = `
    @page {
      margin-top: 130px;
      margin-bottom: 40px;
    }
  `

    const generateTemplate = ejsRender(initialTemplate, body);

    const options = {
      ...getCommonOptions(body),
      headerTemplate: initialHeaderTemplate,
    };

    const generatedPdf = ejsPuppeteerPdfGenerator(generateTemplate, options, pageStyle);

    return generatedPdf;
  }
}

module.exports = ProjectClearance;
