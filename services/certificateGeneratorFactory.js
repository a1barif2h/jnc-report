// const ProjectClearance = require("../pdf_generators/ProjectClearance")

const ProjectClearance = require("../pdf_generators/ProjectClearance");
const ImportPermit = require("../pdf_generators/ImportPermit");
const TradeLicense = require("../pdf_generators/TradeLicense");
const LocalSalesPermit = require("../pdf_generators/LocalSalesPermit");
const ExportPermit = require("../pdf_generators/ExportPermit");
const VisaRecommendation = require("../pdf_generators/VisaRecommendation");
const VisaAssistance = require("../pdf_generators/VisaAssistance");
const LandUsePlan = require("../pdf_generators/LandUsePlan");
const CommercialOperation = require("../pdf_generators/CommercialOperation");
const TradeLicenseRenew = require("../pdf_generators/trade-license-renew");

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
      console.log("Generating pdf for Import Permit");
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
    case "Export Permit":
      const exportPermit = new ExportPermit();
      console.log("Generating pdf for Export Permit");
      generatedPdf = await exportPermit.generate(data);
      break;
    case "Visa Recommendation":
      const visaRecommendation = new VisaRecommendation();
      console.log("Generating pdf for Visa Recommendation");
      generatedPdf = await visaRecommendation.generate(data);
      break;
    case "Visa Assistance":
      const visaAssistance = new VisaAssistance();
      console.log("Generating pdf for Visa Assistance");
      generatedPdf = await visaAssistance.generate(data);
      break;
    case "Land Use Plan":
      const landUsePlan = new LandUsePlan();
      console.log("Generating pdf for Land Use Plan");
      generatedPdf = await landUsePlan.generate(data);
      break;
    case "Commercial Operation":
      const commercialOperation = new CommercialOperation();
      console.log("Generating pdf for Commercial Operation");
      generatedPdf = await commercialOperation.generate(data);
      break;
    case "Trade License Renew":
      const tradeLicenseRenew = new TradeLicenseRenew();
      console.log("Generating pdf for Trade License Renew");
      generatedPdf = await tradeLicenseRenew.generate(data);
      break;
    default:
      break;
  }
  return generatedPdf;
};






module.exports = {
  generate,
};
