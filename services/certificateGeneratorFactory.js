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
const SampleExportPermit=require("../pdf_generators/SampleExportPermit");
const SampleImportPermit=require("../pdf_generators/SampleImportPermit");
const Occupancy=require("../pdf_generators/Occupancy");
const WorkPermit=require("../pdf_generators/WorkPermit");
const allSopsIds=require("../shared/constants/AllSopsIds");
// method()
//    switch
//       case Project Clearance
//           return new ProjectClearance();

const generate = async (data) => {
  let sopId = data.sopId;
  let generatedPdf = null;
  switch (sopId) {
    case allSopsIds.PROJECTCLEARANCE:
      const projectClearance = new ProjectClearance();
      console.log("Generating pdf for project Clearance");
      generatedPdf = await projectClearance.generate(data);
      break;
    case allSopsIds.IMPORTPERMIT:
      const importPermit = new ImportPermit();
      console.log("Generating pdf for Import Permit");
      generatedPdf = await importPermit.generate(data);
      break;
    case allSopsIds.TRADELICENSE:
      const tradeLicense = new TradeLicense();
      console.log("Generating pdf for Trade License");
      generatedPdf = await tradeLicense.generate(data);
      break;
    case allSopsIds.LOCALSALESPERMIT:
      const localSalesPermit = new LocalSalesPermit();
      console.log("Generating pdf for local Sales Permit");
      generatedPdf = await localSalesPermit.generate(data);
      break;
    case allSopsIds.EXPORTPERMIT:
      const exportPermit = new ExportPermit();
      console.log("Generating pdf for Export Permit");
      generatedPdf = await exportPermit.generate(data);
      break;
    case allSopsIds.VISARECOMMENDATION:
      const visaRecommendation = new VisaRecommendation();
      console.log("Generating pdf for Visa Recommendation");
      generatedPdf = await visaRecommendation.generate(data);
      break;
    case allSopsIds.VISAASSISTANCE:
      const visaAssistance = new VisaAssistance();
      console.log("Generating pdf for Visa Assistance");
      generatedPdf = await visaAssistance.generate(data);
      break;
    case allSopsIds.LANDUSEPLAN:
      const landUsePlan = new LandUsePlan();
      console.log("Generating pdf for Land Use Plan");
      generatedPdf = await landUsePlan.generate(data);
      break;
    case allSopsIds.COMMERCIALOPERATION:
      const commercialOperation = new CommercialOperation();
      console.log("Generating pdf for Commercial Operation");
      generatedPdf = await commercialOperation.generate(data);
      break;
    case allSopsIds.TRADELICENSERENEW:
      const tradeLicenseRenew = new TradeLicenseRenew();
      console.log("Generating pdf for work permit");
      generatedPdf = await tradeLicenseRenew.generate(data);
      break;
    case allSopsIds.SAMPLEIMPORTPERMIT:
      const sampleImportPermit = new SampleImportPermit();
      console.log("Generating pdf for Sample Import Permit");
      generatedPdf = await sampleImportPermit.generate(data);
      break;
    case allSopsIds.SAMPLEEXPORTPERMIT:
      const sampleExportPermit = new SampleExportPermit();
      console.log("Generating pdf for Sample Export Permit");
      generatedPdf = await sampleExportPermit.generate(data);
      break;
    case allSopsIds.OCCUPANCY:
      const occupancy = new Occupancy();
      console.log("Generating pdf for Occupancy");
      generatedPdf = await occupancy.generate(data);
      break;
    case allSopsIds.WORKPERMIT:
      const workPermit = new WorkPermit();
      console.log("Generating pdf for Work Permit");
      generatedPdf = await workPermit.generate(data);
      break;
    default:
      break;
  }
  return generatedPdf;
};






module.exports = {
  generate,
};
