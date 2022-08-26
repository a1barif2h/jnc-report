const fs = require('fs');
const pdf = require('./PdfGenerator');
const options = {
    format: 'A4', childProcessOptions: {
        env: {
            OPENSSL_CONF: '/dev/null',
        },
    }, "orientation": "portrait", footer: {
        height: '5mm',
        contents: {
            default:
                '<div id="pageFooter" style="text-align: center; font-size: 8px;">{{page}}/{{pages}}</div>',
        },
    }
};
const replaceMaterialsInProjectClearance = require('../util/replaceMaterialsInProjectClearance');
const logger = require('../util/logger');
// const { logger } = require('../util/helper');



class ProjectRegistration {
    constructor() {
    }
    async generate(body) {
        // logger("project registration", body)
        body.formValue.industryCategory = body.formValue?.industryCategory.name || "";
        let htmlTemplate = fs.readFileSync('./pdf_templates/project-registration/project-registration.html', 'utf8');
        let materialsDesTemplate = fs.readFileSync(
            "./pdf_templates/project-registration/project-registration-materials-description.html",
            "utf8"
        );

        try {
            let localTotal = body.formValue.domesticTotal
            let exportTotal = body.formValue.exportTotal
            localTotal = (localTotal * 100) / (localTotal + exportTotal)
            exportTotal = 100 - localTotal
            materialsDesTemplate = materialsDesTemplate.replaceAll(`{{exportOrientedPercentage}}`, ("" + exportTotal || "-"))
            materialsDesTemplate = materialsDesTemplate.replaceAll(`{{localOrientedPercentage}}`, ("" + localTotal || "-"))
            materialsDesTemplate = replaceMaterialsInProjectClearance.replaceAllMaterialsValue(body, materialsDesTemplate)
            // console.log(body, "==========")
            // console.log("\n\n\n\n\n materialsDesTemplate:\n\n\n\n\n "+materialsDesTemplate)
            htmlTemplate = htmlTemplate.replace(`{{materialsDescription}}`, (materialsDesTemplate || "-"))

        } catch (exceptionVar) {
            logger.error(exceptionVar)
        }
        const response = await pdf.generatePdfFromHtml(htmlTemplate, body, options);
        return response;
    }

}

module.exports = ProjectRegistration;
