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
const RoyaltyFee = require("../pdf_generators/RoyaltyFee");

const generate = async (data) => {
  let sopCode = data.sopCode;
  let generatedPdf = null;
  const AllSopsCodes=allSopsCodes.AllSopsCodes;
  switch (sopCode) {
    case AllSopsCodes.PROJECT_REGISTRATION.value:
      const projectRegistration = new ProjectRegistration();
      logger.info(`Generating pdf for ${AllSopsCodes.PROJECT_REGISTRATION.value}`);
      generatedPdf = await projectRegistration.generate(data);
      break;
    case AllSopsCodes.PROJECT_CLEARANCE.value:
      const projectClearance = new ProjectClearance();
      logger.info(`Generating pdf for ${AllSopsCodes.PROJECT_CLEARANCE.value}`);
      generatedPdf = await projectClearance.generate(data);
      break;
    case AllSopsCodes.IMPORT_PERMIT.value:
      const importPermit = new ImportPermit();
      logger.info(`Generating pdf for ${AllSopsCodes.IMPORT_PERMIT.value}`);
      generatedPdf = await importPermit.generate(data);
      break;
    case AllSopsCodes.TRADE_LICENSE.value:
      const tradeLicense = new TradeLicense();
      logger.info(`Generating pdf for ${AllSopsCodes.TRADE_LICENSE.value}`);
      generatedPdf = await tradeLicense.generate(data);
      break;
    case AllSopsCodes.LOCAL_SALES_PERMIT.value:
      const localSalesPermit = new LocalSalesPermit();
      logger.info(`Generating pdf for ${AllSopsCodes.LOCAL_SALES_PERMIT.value}`);
      generatedPdf = await localSalesPermit.generate(data);
      break;
    case AllSopsCodes.LOCAL_PURCHASE_PERMIT.value:
      const localPurchasePermit = new LocalPurchasePermit();
      logger.info(`Generating pdf for ${AllSopsCodes.LOCAL_PURCHASE_PERMIT.value}`);
      generatedPdf = await localPurchasePermit.generate(data);
      break;
    case AllSopsCodes.EXPORT_PERMIT.value:
      const exportPermit = new ExportPermit();
      logger.info(`Generating pdf for ${AllSopsCodes.EXPORT_PERMIT.value}`);
      generatedPdf = await exportPermit.generate(data);
      break;
    case AllSopsCodes.VISA_RECOMMENDATION.value:
      const visaRecommendation = new VisaRecommendation();
      logger.info(`Generating pdf for ${AllSopsCodes.VISA_RECOMMENDATION.value}`);
      generatedPdf = await visaRecommendation.generate(data);
      break;
    case AllSopsCodes.VISA_ASSISTANCE.value:
      const visaAssistance = new VisaAssistance();
      logger.info(`Generating pdf for ${AllSopsCodes.VISA_ASSISTANCE.value}`);
      generatedPdf = await visaAssistance.generate(data);
      break;
    case AllSopsCodes.LAND_USE_PLAN.value:
      const landUsePlan = new LandUsePlan();
      logger.info(`Generating pdf for ${AllSopsCodes.LAND_USE_PLAN.value}`);
      generatedPdf = await landUsePlan.generate(data);
      break;
    case AllSopsCodes.COMMERCIAL_OPERATION.value:
      const commercialOperation = new CommercialOperation();
      logger.info(`Generating pdf for ${AllSopsCodes.COMMERCIAL_OPERATION.value}`);
      generatedPdf = await commercialOperation.generate(data);
      break;
    case AllSopsCodes.TRADE_LICENSE_RENEW.value:
      const tradeLicenseRenew = new TradeLicenseRenew();
      logger.info(`Generating pdf for ${AllSopsCodes.TRADE_LICENSE_RENEW.value}`);
      generatedPdf = await tradeLicenseRenew.generate(data);
      break;
    case AllSopsCodes.SAMPLE_IMPORT_PERMIT.value:
      const sampleImportPermit = new SampleImportPermit();
      logger.info(`Generating pdf for ${AllSopsCodes.SAMPLE_IMPORT_PERMIT.value}`);
      generatedPdf = await sampleImportPermit.generate(data);
      break;
    case AllSopsCodes.SAMPLE_EXPORT_PERMIT.value:
      const sampleExportPermit = new SampleExportPermit();
      logger.info(`Generating pdf for ${AllSopsCodes.SAMPLE_EXPORT_PERMIT.value}`);
      generatedPdf = await sampleExportPermit.generate(data);
      break;
    case AllSopsCodes.OCCUPANCY.value:
      const occupancy = new Occupancy();
      logger.info(`Generating pdf for ${AllSopsCodes.OCCUPANCY.value}`);
      generatedPdf = await occupancy.generate(data);
      break;
    case AllSopsCodes.WORK_PERMIT.value:
      const workPermit = new WorkPermit();
      logger.info(`Generating pdf for ${AllSopsCodes.WORK_PERMIT.value}`);
      generatedPdf = await workPermit.generate(data);
      break;
    case AllSopsCodes.ROYALTY_FEE.value:
      const royaltyFee = new RoyaltyFee();
      logger.info(`Generating pdf for ${AllSopsCodes.ROYALTY_FEE.value}`);
      generatedPdf = await royaltyFee.generate(data);
      break;
    default:
      break;
  }
  return generatedPdf;
};






module.exports = {
  generate,
};
