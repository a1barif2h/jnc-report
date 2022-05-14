// const ProjectClearance = require("../pdf_generators/ProjectClearance")

const ProjectClearance = require("../pdf_generators/ProjectClearance");
const ImportPermit = require("../pdf_generators/ImportPermit");
const TradeLicense = require("../pdf_generators/TradeLicense");
const LocalSalesPermit = require("../pdf_generators/LocalSalesPermit");
const LocalPurchasePermit = require("../pdf_generators/LocalPurchasePermit");
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
const allSopsCodes=require("../shared/constants/AllSopsCodes");
const ProjectRegistration = require("../pdf_generators/ProjectRegistration");

const generate = async (data) => {
  let sopCode = data.sopCode;
  let generatedPdf = null;
  const AllSopsCodes=allSopsCodes.AllSopsCodes;
  // console.log("sopId:   "+sopCode);
  // console.log("allSopsCodes.EXPORTPERMIT:   "+JSON.stringify(AllSopsCodes));
  switch (sopCode) {
    case AllSopsCodes.PROJECT_REGISTRATION.value:
      console.log("=========this is test for project registration")
      // const projectRegistration = new Project
      const projectRegistration = new ProjectRegistration();
      console.log("Generating pdf for project Clearance");
      generatedPdf = await projectRegistration.generate(data);
      break;
    case AllSopsCodes.PROJECT_CLEARANCE.value:
      const projectClearance = new ProjectClearance();
      console.log("Generating pdf for project Clearance");
      generatedPdf = await projectClearance.generate(data);
      break;
    case AllSopsCodes.IMPORT_PERMIT.value:
      const importPermit = new ImportPermit();
      console.log("Generating pdf for Import Permit");
      generatedPdf = await importPermit.generate(data);
      break;
    case AllSopsCodes.TRADE_LICENSE.value:
      const tradeLicense = new TradeLicense();
      console.log("Generating pdf for Trade License");
      generatedPdf = await tradeLicense.generate(data);
      break;
    case AllSopsCodes.LOCAL_SALES_PERMIT.value:
      const localSalesPermit = new LocalSalesPermit();
      console.log("Generating pdf for local Sales Permit");
      generatedPdf = await localSalesPermit.generate(data);
      break;
    case AllSopsCodes.LOCAL_PURCHASE_PERMIT.value:
      const localPurchasePermit = new LocalPurchasePermit();
      console.log("Generating pdf for Local Purchase permit");
      generatedPdf = await localPurchasePermit.generate(data);
      break;
    case AllSopsCodes.EXPORT_PERMIT.value:
      const exportPermit = new ExportPermit();
      console.log("Generating pdf for Export Permit");
      generatedPdf = await exportPermit.generate(data);
      break;
    case AllSopsCodes.VISA_RECOMMENDATION.value:
      const visaRecommendation = new VisaRecommendation();
      console.log("Generating pdf for Visa Recommendation");
      generatedPdf = await visaRecommendation.generate(data);
      break;
    case AllSopsCodes.VISA_ASSISTANCE.value:
      const visaAssistance = new VisaAssistance();
      console.log("Generating pdf for Visa Assistance");
      generatedPdf = await visaAssistance.generate(data);
      break;
    case AllSopsCodes.LAND_USE_PLAN.value:
      const landUsePlan = new LandUsePlan();
      console.log("Generating pdf for Land Use Plan");
      generatedPdf = await landUsePlan.generate(data);
      break;
    case AllSopsCodes.COMMERCIAL_OPERATION.value:
      const commercialOperation = new CommercialOperation();
      console.log("Generating pdf for Commercial Operation");
      generatedPdf = await commercialOperation.generate(data);
      break;
    case AllSopsCodes.TRADE_LICENSE_RENEW.value:
      const tradeLicenseRenew = new TradeLicenseRenew();
      console.log("Generating pdf for work permit");
      generatedPdf = await tradeLicenseRenew.generate(data);
      break;
    case AllSopsCodes.SAMPLE_IMPORT_PERMIT.value:
      const sampleImportPermit = new SampleImportPermit();
      console.log("Generating pdf for Sample Import Permit");
      generatedPdf = await sampleImportPermit.generate(data);
      break;
    case AllSopsCodes.SAMPLE_EXPORT_PERMIT.value:
      const sampleExportPermit = new SampleExportPermit();
      console.log("Generating pdf for Sample Export Permit");
      generatedPdf = await sampleExportPermit.generate(data);
      break;
    case AllSopsCodes.OCCUPANCY.value:
      const occupancy = new Occupancy();
      console.log("Generating pdf for Occupancy");
      generatedPdf = await occupancy.generate(data);
      break;
    case AllSopsCodes.WORK_PERMIT.value:
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
