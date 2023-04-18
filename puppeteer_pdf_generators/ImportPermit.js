const fs = require('fs');
const { ejsRender } = require('../util/templateEngine');
const { getCommonOptions } = require('../util/utils');
const { ejsPuppeteerPdfGenerator } = require('../pdf_generators/PdfGenerator');
const ejsUtils = require('../util/ejsUtils');
const { CARRIER_TYPE } = require('../constants/const');
const { changeDateFormat } = require('../util/dateTimeFormattor');
const { numberWithCommas } = require('../util/amountToWordUtil');

class ImportPermit {
    constructor() { };

    handleArrivalAndDepartureValueBasedOnCarrierType(formValue, materialDetail) {
        const carrierType = formValue.carrierType;
        const naString = "N/A";

        let hiddenCompoValueOne = naString, hiddenCompoValueTwo = naString;

        switch (carrierType) {
            case CARRIER_TYPE.byAir:
                const flightNumber = formValue.flightNumber;
                hiddenCompoValueOne = flightNumber || naString;
                hiddenCompoValueTwo = new Date(formValue.flightDate);
                break;

            case CARRIER_TYPE.bySea:
                hiddenCompoValueOne = new Date(formValue.arrivalDateSea);
                hiddenCompoValueTwo = new Date(formValue.departureDateSea);
                break;

            case CARRIER_TYPE.byRoad:
                hiddenCompoValueOne = new Date(formValue.arrivalDateRoad);
                hiddenCompoValueTwo = new Date(formValue.departureDateRoad);
                break;
            default:
                break;
        }

        hiddenCompoValueOne = (carrierType === CARRIER_TYPE.byAir) ? hiddenCompoValueOne
            : (!isNaN(hiddenCompoValueOne) ? hiddenCompoValueOne.toLocaleDateString() : naString);

        hiddenCompoValueTwo = !isNaN(hiddenCompoValueTwo) ? hiddenCompoValueTwo.toLocaleDateString() : naString
        materialDetail["hiddenCompoValueOne"] = hiddenCompoValueOne;
        materialDetail["hiddenCompoValueTwo"] = hiddenCompoValueTwo;
    }

    handleDateTimeFormat(formValue) {
        //DATE TIME FORMAT: 13 August 2022
        changeDateFormat(formValue, "invoiceVendorRefDate");
        changeDateFormat(formValue, "undertakingDate");
        changeDateFormat(formValue, "carrierPassportValidity");

        formValue.importMaterialsInformationGroup.map((materialDetail) => {
            this.handleArrivalAndDepartureValueBasedOnCarrierType(formValue, materialDetail);
            materialDetail.hiddenCompoLabelOne !== "Flight No. :" && changeDateFormat(materialDetail, "hiddenCompoValueOne");
            changeDateFormat(materialDetail, "hiddenCompoValueTwo");
        })

        formValue.ttPOScCmLCInformationContainer.map((lcDetails) => {
            changeDateFormat(lcDetails, "issueDate");
            changeDateFormat(lcDetails, "expireDate");
        })
    }

    handleAmountThousandsSeparator(formValue) {
        formValue["fobCurrencyValue"] = numberWithCommas(formValue["fobCurrencyValue"]);
        formValue.importMaterialsInformationGroup.map((importMaterialsInfo, idx) => {
            formValue.importMaterialsInformationGroup[idx]["fobCurrencyValue1"] = numberWithCommas(importMaterialsInfo["fobCurrencyValue1"]);
        })

        formValue.ttPOScCmLCInformationContainer.map((ttPoScCmLCInfo, idx) => {
            formValue.ttPOScCmLCInformationContainer[idx]["ttvalueHidden"] = numberWithCommas(ttPoScCmLCInfo["ttvalueHidden"])
        })
    }

    async generate(body) {
        this.handleDateTimeFormat(body.formValue);
        this.handleAmountThousandsSeparator(body.formValue);

        body.formValue.utils = ejsUtils;

        const initialTemplate = fs.readFileSync('./ejs_pdf_templates/import-permit/import-permit.ejs', 'utf8');
        const initialHeaderTemplate = fs.readFileSync('./ejs_pdf_templates/import-permit/header-template.ejs', 'utf8');

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

module.exports = ImportPermit;