// const ProjectClearance = require("../pdf_generators/ProjectClearance")

const ProjectClearance = require("../pdf_generators/ProjectClearance");
const ImportPermit = require("../pdf_generators/ImportPermit");
const ExportPermit = require("../pdf_generators/ExportPermit");
const VisaRecommendation = require("../pdf_generators/VisaRecommendation");
const VisaAssistance = require("../pdf_generators/VisaAssistance");
const LandUsePlan = require("../pdf_generators/LandUsePlan");

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
      case "Import Permit  v2":
        const importPermit = new ImportPermit();
        console.log("Generating pdf for Import Permit  v2");
        generatedPdf = await importPermit.generate(data);
        break;
      case "Export Permit":
        const exportPermit = new ExportPermit();
        console.log("Generating pdf for Export Permit");
        generatedPdf = await exportPermit.generate(data);
    case "Visa Recommendation":
        const visaRecommendation = new VisaRecommendation();
        console.log("Generating pdf for Visa Recommendation");
        generatedPdf = await visaRecommendation.generate(data);
    case "Visa Assistance":
        const visaAssistance = new VisaAssistance();
        console.log("Generating pdf for Visa Assistance");
        generatedPdf = await visaAssistance.generate(data);
    case "Land Use Plan":
        const landUsePlan = new LandUsePlan();
        console.log("Generating pdf for Land Use Plan");
        generatedPdf = await landUsePlan.generate(data);
    default:
        break;
    }
    return generatedPdf;
}

module.exports = {
    generate
}