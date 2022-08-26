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
const logger = require("../util/logger");

const generate = async (data) => {
  let sopCode = data.sopCode;
  let generatedPdf = null;
  const AllSopsCodes=allSopsCodes.AllSopsCodes;
  switch (sopCode) {
    case AllSopsCodes.PROJECT_REGISTRATION.value:
      const projectRegistration = new ProjectRegistration();
      // console.log("Generating pdf for project Registration");
      logger.info(`Generating pdf for ${AllSopsCodes.PROJECT_REGISTRATION.value}`);
      generatedPdf = await projectRegistration.generate(data);
      break;
    case AllSopsCodes.PROJECT_CLEARANCE.value:
      const projectClearance = new ProjectClearance();
      // console.log("Generating pdf for project Clearance");
      logger.info(`Generating pdf for ${AllSopsCodes.PROJECT_CLEARANCE.value}`);
      generatedPdf = await projectClearance.generate(data);
      break;
    case AllSopsCodes.IMPORT_PERMIT.value:
      const importPermit = new ImportPermit();
      // console.log("Generating pdf for Import Permit");
      logger.info(`Generating pdf for ${AllSopsCodes.IMPORT_PERMIT.value}`);
      generatedPdf = await importPermit.generate(data);
      break;
    case AllSopsCodes.TRADE_LICENSE.value:
      const tradeLicense = new TradeLicense();
      // console.log("Generating pdf for Trade License");
      logger.info(`Generating pdf for ${AllSopsCodes.TRADE_LICENSE.value}`);
      generatedPdf = await tradeLicense.generate(data);
      break;
    case AllSopsCodes.LOCAL_SALES_PERMIT.value:
      const localSalesPermit = new LocalSalesPermit();
      // console.log("Generating pdf for local Sales Permit");
      logger.info(`Generating pdf for ${AllSopsCodes.LOCAL_SALES_PERMIT.value}`);
      generatedPdf = await localSalesPermit.generate(data);
      break;
    case AllSopsCodes.LOCAL_PURCHASE_PERMIT.value:
      const localPurchasePermit = new LocalPurchasePermit();
      // console.log("Generating pdf for Local Purchase permit");
      logger.info(`Generating pdf for ${AllSopsCodes.LOCAL_PURCHASE_PERMIT.value}`);
      generatedPdf = await localPurchasePermit.generate(data);
      break;
    case AllSopsCodes.EXPORT_PERMIT.value:
      const exportPermit = new ExportPermit();
      // console.log("Generating pdf for Export Permit");
      logger.info(`Generating pdf for ${AllSopsCodes.EXPORT_PERMIT.value}`);
      generatedPdf = await exportPermit.generate(data);
      break;
    case AllSopsCodes.VISA_RECOMMENDATION.value:
      const visaRecommendation = new VisaRecommendation();
      // console.log("Generating pdf for Visa Recommendation");
      logger.info(`Generating pdf for ${AllSopsCodes.VISA_RECOMMENDATION.value}`);
      generatedPdf = await visaRecommendation.generate(data);
      break;
    case AllSopsCodes.VISA_ASSISTANCE.value:
      const visaAssistance = new VisaAssistance();
      // console.log("Generating pdf for Visa Assistance");
      logger.info(`Generating pdf for ${AllSopsCodes.VISA_ASSISTANCE.value}`);
      generatedPdf = await visaAssistance.generate(data);
      break;
    case AllSopsCodes.LAND_USE_PLAN.value:
      const landUsePlan = new LandUsePlan();
      // console.log("Generating pdf for Land Use Plan");
      logger.info(`Generating pdf for ${AllSopsCodes.LAND_USE_PLAN.value}`);
      generatedPdf = await landUsePlan.generate(data);
      break;
    case AllSopsCodes.COMMERCIAL_OPERATION.value:
      const commercialOperation = new CommercialOperation();
      // console.log("Generating pdf for Commercial Operation");
      logger.info(`Generating pdf for ${AllSopsCodes.COMMERCIAL_OPERATION.value}`);
      generatedPdf = await commercialOperation.generate(data);
      break;
    case AllSopsCodes.TRADE_LICENSE_RENEW.value:
      const tradeLicenseRenew = new TradeLicenseRenew();
      // console.log("Generating pdf for work permit");
      logger.info(`Generating pdf for ${AllSopsCodes.TRADE_LICENSE_RENEW.value}`);
      generatedPdf = await tradeLicenseRenew.generate(data);
      break;
    case AllSopsCodes.SAMPLE_IMPORT_PERMIT.value:
      const sampleImportPermit = new SampleImportPermit();
      // console.log("Generating pdf for Sample Import Permit");
      logger.info(`Generating pdf for ${AllSopsCodes.SAMPLE_IMPORT_PERMIT.value}`);
      generatedPdf = await sampleImportPermit.generate(data);
      break;
    case AllSopsCodes.SAMPLE_EXPORT_PERMIT.value:
      const sampleExportPermit = new SampleExportPermit();
      // console.log("Generating pdf for Sample Export Permit");
      logger.info(`Generating pdf for ${AllSopsCodes.SAMPLE_EXPORT_PERMIT.value}`);
      generatedPdf = await sampleExportPermit.generate(data);
      break;
    case AllSopsCodes.OCCUPANCY.value:
      const occupancy = new Occupancy();
      // console.log("Generating pdf for Occupancy");
      logger.info(`Generating pdf for ${AllSopsCodes.OCCUPANCY.value}`);
      generatedPdf = await occupancy.generate(data);
      break;
    case AllSopsCodes.WORK_PERMIT.value:
      const workPermit = new WorkPermit();
      // console.log("Generating pdf for Work Permit");
      logger.info(`Generating pdf for ${AllSopsCodes.WORK_PERMIT.value}`);
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
