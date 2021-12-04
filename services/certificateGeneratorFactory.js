// const ProjectClearance = require("../pdf_generators/ProjectClearance")

const ProjectClearance = require("../pdf_generators/ProjectClearance");
const ImportPermit = require("../pdf_generators/ImportPermit");
const TradeLicense = require("../pdf_generators/TradeLicense");
const LocalSalesPermit = require("../pdf_generators/LocalSalesPermit");

// method() 
//    switch
//       case Project Clearance 
//           return new ProjectClearance();

const generate = async (data) => {

    
    
    let title = data.title;
    let generatedPdf = null;
    switch (title) {
      case "Project Clearance":
        const projectClearance = new ProjectClearance();
        console.log("Generating pdf for project Clearance");
        generatedPdf = await projectClearance.generate(data);
        break;
      case "Import Permit":
        const importPermit = new ImportPermit();
        console.log("Generating pdf for Import Permit  v2");
        generatedPdf = await importPermit.generate(data);
        break;
      case "Trade License":
        const tradeLicense = new TradeLicense();
        console.log("Generating pdf for Trade License");
        generatedPdf = await tradeLicense.generate(data);
        break;
      case "Local Sales Permit":
        const localSalesPermit = new LocalSalesPermit();
        console.log("Generating pdf for local Sales Permit");
        generatedPdf = await localSalesPermit.generate(data);
        break;
      default:
        break;
    }
    return generatedPdf;
}

module.exports = {
    generate
}