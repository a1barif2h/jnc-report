
const { 
    ProjectClearance, 
    TradeLicense, 
    TradeLicenseRenew, 
    TechnicalKnowHowFee, 
    RoyaltyFee, 
    ImportPermit, 
    ExportPermit,
    SampleImportPermit,
    SampleExportPermit,
    VisaRecommendation,
    VisaAssistance,
    CommercialOperation,
    LocalSalesPermit,
    LocalPurchasePermit,
    LandUsePlan,
    BuildingPermit,
    Occupancy,
    PartialUseOfBuilding,
    BuildingDesignModification,
    WorkPermit
} = require("../puppeteer_pdf_generators");
const { AllSopsCodes } = require("../shared/constants/AllSopsCodes");
const logger = require("../util/logger");

const generate = async (data) => {
    let sopCode = data.sopCode;
    let generatedPdf = null;

    switch (sopCode) {
        case AllSopsCodes.PROJECT_CLEARANCE.value:
            const projectClearance = new ProjectClearance();
            logger.info(`Generating ejs and puppeteer pdf for ${AllSopsCodes.PROJECT_CLEARANCE.value}`);
            generatedPdf = await projectClearance.generate(data);
            break;
        
        case AllSopsCodes.TRADE_LICENSE.value:
            const tradeLicense = new TradeLicense();
            logger.info(`Generating ejs and puppeteer pdf for ${AllSopsCodes.TRADE_LICENSE.value}`);
            generatedPdf = await tradeLicense.generate(data);
            break;

        case AllSopsCodes.TRADE_LICENSE_RENEW.value:
            const tradeLicenseRenew = new TradeLicenseRenew();
            logger.info(`Generating ejs and puppeteer pdf for ${AllSopsCodes.TRADE_LICENSE_RENEW.value}`);
            generatedPdf = await tradeLicenseRenew.generate(data);
            break;

        case AllSopsCodes.TECHNICAL_KNOW_HOW_FEE.value:
            const technicalKnowHowFee = new TechnicalKnowHowFee();
            logger.info(`Generating ejs and puppeteer pdf for ${AllSopsCodes.TECHNICAL_KNOW_HOW_FEE.value}`);
            generatedPdf = await technicalKnowHowFee.generate(data);
            break;

        case AllSopsCodes.ROYALTY_FEE.value:
            const royaltyFee = new RoyaltyFee();
            logger.info(`Generating ejs and puppeteer pdf for ${AllSopsCodes.ROYALTY_FEE.value}`);
            generatedPdf = await royaltyFee.generate(data);
            break;

        case  AllSopsCodes.IMPORT_PERMIT.value:
            const importPermit = new ImportPermit();
            logger.info(`Generating ejs and puppeteer pdf for ${AllSopsCodes.IMPORT_PERMIT.value}`);
            generatedPdf = await importPermit.generate(data);
            break;

        case AllSopsCodes.EXPORT_PERMIT.value:
            const exportPermit = new ExportPermit();
            logger.info(`Generating ejs and puppeteer pdf for ${AllSopsCodes.EXPORT_PERMIT.value}`);
            generatedPdf = await exportPermit.generate(data);
            break;

        case AllSopsCodes.SAMPLE_IMPORT_PERMIT.value:
            const sampleImportPermit = new SampleImportPermit();
            logger.info(`Generating ejs and puppeteer pdf for ${AllSopsCodes.SAMPLE_IMPORT_PERMIT.value}`);
            generatedPdf = await sampleImportPermit.generate(data);
            break;

        case AllSopsCodes.SAMPLE_EXPORT_PERMIT.value:
            const sampleExportPermit = new SampleExportPermit();
            logger.info(`Generating ejs and puppeteer pdf for ${AllSopsCodes.SAMPLE_EXPORT_PERMIT.value}`);
            generatedPdf = await sampleExportPermit.generate(data);
            break;

        case AllSopsCodes.VISA_RECOMMENDATION.value:
            const visaRecommendation = new VisaRecommendation();
            logger.info(`Generating ejs and puppeteer pdf for ${AllSopsCodes.VISA_RECOMMENDATION.value}`);
            generatedPdf = await visaRecommendation.generate(data);
            break;

        case AllSopsCodes.VISA_ASSISTANCE.value:
            const visaAssistance = new VisaAssistance();
            logger.info(`Generating ejs and puppeteer pdf for ${AllSopsCodes.VISA_ASSISTANCE.value}`);
            generatedPdf = await visaAssistance.generate(data);
            break;

        case AllSopsCodes.COMMERCIAL_OPERATION.value:
            const commercialOperation = new CommercialOperation();
            logger.info(`Generating ejs and puppeteer pdf for ${AllSopsCodes.COMMERCIAL_OPERATION.value}`);
            generatedPdf = await commercialOperation.generate(data);
            break;

        case AllSopsCodes.LOCAL_SALES_PERMIT.value:
            const localSalesPermit = new LocalSalesPermit();
            logger.info(`Generating ejs and puppeteer pdf for ${AllSopsCodes.LOCAL_SALES_PERMIT.value}`);
            generatedPdf = await localSalesPermit.generate(data);
            break;

        case AllSopsCodes.LOCAL_PURCHASE_PERMIT.value:
            const localPurchasePermit = new LocalPurchasePermit();
            logger.info(`Generating ejs and puppeteer pdf for ${AllSopsCodes.LOCAL_PURCHASE_PERMIT.value}`);
            generatedPdf = await localPurchasePermit.generate(data);
            break;

        case AllSopsCodes.LAND_USE_PLAN.value:
            const landUsePlan = new LandUsePlan();
            logger.info(`Generating ejs and puppeteer pdf for ${AllSopsCodes.LAND_USE_PLAN.value}`);
            generatedPdf = await landUsePlan.generate(data);
            break;

        case AllSopsCodes.BUILDING_PERMIT.value:
            const buildingPermit = new BuildingPermit();
            logger.info(`Generating ejs and puppeteer pdf for ${AllSopsCodes.BUILDING_PERMIT.value}`);
            generatedPdf = await buildingPermit.generate(data);
            break;

        case AllSopsCodes.OCCUPANCY.value:
            const occupancy = new Occupancy();
            logger.info(`Generating ejs and puppeteer pdf for ${AllSopsCodes.OCCUPANCY.value}`);
            generatedPdf = await occupancy.generate(data);
            break;

        case AllSopsCodes.PARTIAL_USE_OF_BUILDING.value:
            const partialUseOfBuilding = new PartialUseOfBuilding();
            logger.info(`Generating ejs and puppeteer pdf for ${AllSopsCodes.PARTIAL_USE_OF_BUILDING.value}`);
            generatedPdf = await partialUseOfBuilding.generate(data);
            break;

        case AllSopsCodes.BUILDING_DESIGN_MODIFICATION.value:
            const buildingDesignModification = new BuildingDesignModification();
            logger.info(`Generating ejs and puppeteer pdf for ${AllSopsCodes.BUILDING_DESIGN_MODIFICATION.value}`);
            generatedPdf = await buildingDesignModification.generate(data);
            break;

        case AllSopsCodes.WORK_PERMIT.value:
            const workPermit = new WorkPermit();
            logger.info(`Generating ejs and puppeteer pdf for ${AllSopsCodes.WORK_PERMIT.value}`);
            generatedPdf = await workPermit.generate(data);
            break;
            
        default:
            break;
    }

    return generatedPdf;
}

module.exports = {
    generate,
}