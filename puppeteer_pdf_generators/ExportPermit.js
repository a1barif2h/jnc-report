const fs = require('fs');
const { ejsRender } = require('../util/templateEngine');
const { getCommonOptions } = require('../util/utils');
const { ejsPuppeteerPdfGenerator } = require('../pdf_generators/PdfGenerator');
const ejsUtils = require('../util/ejsUtils');
const { CARRIER_TYPE } = require('../constants/const');
const { changeDateFormat } = require('../util/dateTimeFormattor');
const { numberWithCommas } = require('../util/amountToWordUtil');

class ExportPermit {
    constructor() { };

    handleDateTimeFormat(formValue) {
        //DATE TIME FORMAT: 13 August 2022
        changeDateFormat(formValue, "invoiceVendorRefDate");
        changeDateFormat(formValue, "undertakingNo1");
        changeDateFormat(formValue, "carrierPassportValidity");
    
        formValue.ttPOScCmLCInformationContainer.map((lcDetails) => {
          changeDateFormat(lcDetails, "issueDate");
          changeDateFormat(lcDetails, "expiryDate");
        })
      }

      handleAmountThousandsSeparator(formValue) {
        formValue["cmCurrencyValue"] = numberWithCommas(formValue["cmCurrencyValue"]);
        formValue["fobCurrencyValue"] = numberWithCommas(formValue["fobCurrencyValue"]);
    
        formValue.exportMaterialsInformationGroup.map((exportMaterialsInfo, idx) => {
          formValue.exportMaterialsInformationGroup[idx]["fobCurrencyValue1"] = numberWithCommas(exportMaterialsInfo["fobCurrencyValue1"]);
        })
    
        formValue.ttPOScCmLCInformationContainer.map((ttPoScCmLCInfo, idx) => {
          formValue.ttPOScCmLCInformationContainer[idx]["ttvalueHidden"] = numberWithCommas(ttPoScCmLCInfo["ttvalueHidden"])
        })
      }

    async generate(body) {
        this.handleDateTimeFormat(body.formValue);
        this.handleAmountThousandsSeparator(body.formValue);

        body.formValue.utils = ejsUtils;

        const initialTemplate = fs.readFileSync('./ejs_pdf_templates/export-permit/export-permit.ejs', 'utf8');
        const initialHeaderTemplate = fs.readFileSync('./ejs_pdf_templates/export-permit/header-template.ejs', 'utf8');

        const headerTemplate = ejsRender(initialHeaderTemplate, body);
        const generateTemplate = ejsRender(initialTemplate, body);

        const options = {
            ...getCommonOptions(body),
            headerTemplate,
        };

        const pageStyle = `
            @page {
                margin-top: 150px;
                margin-bottom: 200px;
            }
        `;

        const generatedPdf = ejsPuppeteerPdfGenerator(generateTemplate, options, pageStyle);

        return generatedPdf;
    }
};

module.exports = ExportPermit;