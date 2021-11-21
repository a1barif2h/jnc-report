// const ProjectClearance = require("../pdf_generators/ProjectClearance")

const ProjectClearance = require("../pdf_generators/ProjectClearance");
const ImportPermit = require("../pdf_generators/ImportPermit");

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
      default:
        break;
    }
    return generatedPdf;
}

module.exports = {
    generate
}