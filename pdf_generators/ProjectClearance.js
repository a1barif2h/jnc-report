const { response } = require("express");
const fs = require("fs");
const pdf = require("./PdfGenerator");
const background_image = fs.readFileSync(
  "./pdf_templates/background_image.html",
  "utf8"
);
const background_cancelled = fs.readFileSync(
  "./pdf_templates/background_cancelled.html",
  "utf8"
);
const replaceMaterialsInProjectClearance = require("../util/replaceMaterialsInProjectClearance");
const currencyConverter = require("../util/currencyConverter");
const logger = require("../util/logger");
const { changeDateFormat } = require("../util/dateTimeFormattor");
const {getMachenariesByApplicationID} = require("../services/gateway_services/bezaServiceGateway");
const { MachineriesConstants } = require("../constants/MachineriesConstants");
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

// if(process.env.NODE_ENV !== "production") {
  // logger.info(`adding childProcessOptions for creating pdf in staging`)
  options.childProcessOptions = {
    env: {
      OPENSSL_CONF: '/dev/null',
    },
  }
// }

class ProjectClearance {
  constructor() {}

  handleDateTimeFormat(formValue) {
    //DATE TIME FORMAT: 13 August 2022
    changeDateFormat(formValue, "applicationDate");
  }

  async getMachineries (applicationId, additionOfMachinery, addMachineriesByFile) {
    let machineriesToCalculate = [];
    if(addMachineriesByFile) {
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

  addInfrastructureTable(machineriesToCalculate) {
    try {
      let annexure1Template = fs.readFileSync(
        "./pdf_templates/project-clearance/infrastructures-annexure-1.html",
        "utf8"
      );
      // this.getMachineriesTableAnnexure2(machineriesToCalculate);
      let machineries = this.addMachineriesTable(machineriesToCalculate);
      annexure1Template = annexure1Template.replace("{{additionOfMachineriesListAnnexure2}}", machineries)
      return annexure1Template;
    } catch (error) {
      console.error(error);
      return "";
    }
  }

  addMachineriesTable(machineriesToCalculate) {
    if(machineriesToCalculate == null || machineriesToCalculate.length == 0) return "";
    let additionOfMachineriesList = "";
    try {
      let annexure2Template = fs.readFileSync(
        "./pdf_templates/project-clearance/materials-annexure-2.html",
        "utf8"
      );

      const annexure2PageBreak = fs.readFileSync(
        "./pdf_templates/project-clearance/materials-annexure-2-page-break.html",
        "utf8"
      );
      
      additionOfMachineriesList += "<tbody>";

      machineriesToCalculate.forEach((element,i) => {
        additionOfMachineriesList += "<tr>";
        additionOfMachineriesList += "<td>"+(element.detailsOfMachinery || "")+"</td>";
        additionOfMachineriesList += "<td>"+(element.coountryOfOrigin || "")+"</td>";
        additionOfMachineriesList += "<td>"+(element.nameOfTheVendor || "")+"</td>";
        additionOfMachineriesList += "<td>"+(numberWithCommas(element.valueInput) || "")+"</td>";
        additionOfMachineriesList += "<td>"+(element.valueCurrency || "")+"</td>";
        additionOfMachineriesList += "<td>"+(element.materialState || "")+"</td>";
        
        additionOfMachineriesList += "</tr>";
        const machineriesFirstPageConstants = MachineriesConstants.FIRST_PAGE_MACHINERIES;
        const machineriesPerPageConstants = MachineriesConstants.PER_PAGE_MACHINERIES;
        const diffBetweenFirstAndOtherPageItems = machineriesPerPageConstants - machineriesFirstPageConstants;
        if(i>0 && i%machineriesFirstPageConstants==0 && i<(machineriesToCalculate.length-1) && i<=machineriesFirstPageConstants) {
          additionOfMachineriesList+=annexure2PageBreak;
        }
        else if(i>machineriesFirstPageConstants && (i+diffBetweenFirstAndOtherPageItems)%machineriesPerPageConstants==0 && i<(machineriesToCalculate.length-1)) {
          additionOfMachineriesList+=annexure2PageBreak;
        }
      });
      
      
  
        additionOfMachineriesList += "</tbody>";
        annexure2Template = annexure2Template.replace("{{additionOfMachineriesListAn2}}", additionOfMachineriesList);
        
      return annexure2Template;
    } catch (error) {
      console.error(error);
      return "";
    }
  }

  handleAmountThousandsSeparator(formValue) {
    formValue["machineryCurrencyValue"] = numberWithCommas(formValue["machineryCurrencyValue"])
    formValue["dCostOfTheProjectInUs"] = numberWithCommas(formValue["dCostOfTheProjectInUs"])
  }

  async generate(body) {

    this.handleDateTimeFormat(body.formValue);
    const machineriesToCalculate = await this.getMachineries(body?.id, body.formValue?.additionOfMachinery, body.formValue?.addMachineriesByFile);
    const currencyList = this.#getCurrencyList(machineriesToCalculate);
    
    body.formValue.infrastructuresListAnnexure1 = this.addInfrastructureTable(machineriesToCalculate);
    // body.formValue.additionOfMachineriesListAnnexure2 = this.getMachineriesTableAnnexure2(machineriesToCalculate);
    const totalMachineryAmount = await currencyConverter(currencyList, "USD");
    body.formValue.machineryCurrencyValue = totalMachineryAmount.toFixed(2);
    body.formValue.machineryCurrency = "USD";

    this.handleAmountThousandsSeparator(body.formValue)
    let htmlTemplate = fs.readFileSync(
      "./pdf_templates/project-clearance/project-clearance.html",
      "utf8"
    );
    let materialsDesTemplate = fs.readFileSync(
      "./pdf_templates/project-clearance/project-clearance-materials-description.html",
      "utf8"
    );

    htmlTemplate.replace( "`{{additionOfMachineriesListAnnexure2}}`",
     "" + body.formValue.additionOfMachineriesListAnnexure2 || "");

    try {
      let localTotal = body.formValue.domesticTotal;
      let exportTotal = body.formValue.exportTotal;
      localTotal = (localTotal * 100) / (localTotal + exportTotal);
      exportTotal = 100 - localTotal;
      materialsDesTemplate = materialsDesTemplate.replaceAll(
        `{{exportOrientedPercentage}}`,
        "" + exportTotal || "-"
      );
      materialsDesTemplate = materialsDesTemplate.replaceAll(
        `{{localOrientedPercentage}}`,
        "" + localTotal || "-"
      );
      materialsDesTemplate =
        replaceMaterialsInProjectClearance.replaceAllMaterialsValue(
          body,
          materialsDesTemplate
        );
      htmlTemplate = htmlTemplate.replace(
        `{{materialsDescription}}`,
        materialsDesTemplate || "-"
      );
    } catch (exceptionVar) {
      logger.error(exceptionVar);
    }
    const response = await pdf.generatePdfFromHtml(htmlTemplate, body, options);
    return response;
  }
}

module.exports = ProjectClearance;
