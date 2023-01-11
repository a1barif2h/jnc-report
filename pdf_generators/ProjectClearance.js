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

  getInfrastructureTableAnnexure1() {
    try {
      let annexure1Template = fs.readFileSync(
        "./pdf_templates/project-clearance/infrastructures-annexure-1.html",
        "utf8"
      );
      return annexure1Template;
    } catch (error) {
      console.error(error);
      return "";
    }
  }

  getMachineriesTableAnnexure2(machineriesToCalculate) {
    if(machineriesToCalculate == null || machineriesToCalculate.length == 0) return "";
    let additionOfMachineriesList = "";
    try {
      let annexure2Template = fs.readFileSync(
        "./pdf_templates/project-clearance/materials-annexure-2.html",
        "utf8"
      );
  
      additionOfMachineriesList += "<tbody>";
      
      machineriesToCalculate.length > 0 && machineriesToCalculate.map((machinery) => {
        additionOfMachineriesList += "<tr>";
        additionOfMachineriesList += "<td>"+(machinery.detailsOfMachinery || "")+"</td>";
        additionOfMachineriesList += "<td>"+(machinery.coountryOfOrigin || "")+"</td>";
        additionOfMachineriesList += "<td>"+(machinery.nameOfTheVendor || "")+"</td>";
        additionOfMachineriesList += "<td>"+(machinery.valueInput || "")+"</td>";
        additionOfMachineriesList += "<td>"+(machinery.valueCurrency || "")+"</td>";
        additionOfMachineriesList += "<td>"+(machinery.state || "")+"</td>";
          
        additionOfMachineriesList += "</tr>";
      });
  
        additionOfMachineriesList += "</tbody>";
        annexure2Template = annexure2Template.replace("{{additionOfMachineriesListAn2}}", additionOfMachineriesList);
        
      return annexure2Template;
    } catch (error) {
      console.error(error);
      return "";
    }
  }

  async generate(body) {

    this.handleDateTimeFormat(body.formValue);
    const machineriesToCalculate = await this.getMachineries(body?.id, body.formValue?.additionOfMachinery, body.formValue?.addMachineriesByFile);
    const currencyList = this.#getCurrencyList(machineriesToCalculate);
    body.formValue.additionOfMachineriesListAnnexure2 = this.getMachineriesTableAnnexure2(machineriesToCalculate);
    body.formValue.infrastructuresListAnnexure1 = this.getInfrastructureTableAnnexure1();
    body.formValue.machineryCurrencyValue = await currencyConverter(currencyList, "USD");
    body.formValue.machineryCurrency = "USD";
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
