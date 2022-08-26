const bezaServiceGateway = require("./gateway_services/bezaServiceGateway");
const certificateGeneratorFactory = require('../services/certificateGeneratorFactory');
const dateTimeFormattor = require('../util/dateTimeFormattor');
const JsBarcode = require('jsbarcode')
var QRCode = require('qrcode')
const { DOMImplementation, XMLSerializer } = require('xmldom');
const xmlSerializer = new XMLSerializer();
const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
const { config } = require("../config/config.js");
const fs = require("fs");
const encryption = require("../util/encryption");
const background_image = fs.readFileSync('./pdf_templates/background_image.html',"utf8");
const background_cancelled = fs.readFileSync('./pdf_templates/background_cancelled.html',"utf8");
const moment = require('moment')
const { AllSopsCodes }=require("../shared/constants/AllSopsCodes");
// const { logger } = require("../util/helper");

const generateQR = async text => {
    try {
    return await QRCode.toDataURL(text);
    } catch (err) {
      console.error(err)
    }
  }

const generateBarcode = async text => {
    JsBarcode(svgNode, text, {
        xmlDocument: document,
        width: 0.75,
        height: 25,
        displayValue: false
    });
    
    const barcodeData = xmlSerializer.serializeToString(svgNode);
    return barcodeData;
}

const generateCertificate = async (req) => {
    let userSopById;
    let bufferResponse;
    let certificateDetail;
    let deskUserSignature;
    let response;

    await bezaServiceGateway
                    .getFormValueByApplicationID(req.body.applicationId).then(
                       async res=>{
                            const appId = encryption.encrypt(""+req.body.applicationId);
                            
                            colonOrNot = config.BEZA_FRONT_END_PORT == "" ? "" : ":";
                            const url =
                              `${config.BEZA_FRONT_END_BASE_URL}${colonOrNot}${config.BEZA_FRONT_END_PORT}/validate-certificate?applicationId=` +
                              appId;
                            await generateQR(url).then(qrRes=> res.formValue.qrcode = qrRes).catch(err=> console.log(err));

                            await generateBarcode(res.trackingId).then (barRes => res.formValue.barcode = barRes).catch(err=> console.log(err));

                            if (res.additionalInfo != null && res.sopCode == AllSopsCodes.OCCUPANCY.value) {
                                let inspectionDate = res?.additionalInfo?.inspectionDate;

                                if(inspectionDate) {
                                    inspectionDate = new Date(inspectionDate).toLocaleDateString()
                                    res.additionalInfo.inspectionDate = inspectionDate 
                                    ? dateTimeFormattor.getFormatDate(inspectionDate) : " ";
                                }
                                Object.keys(res.additionalInfo).map((key) => {
                                    if (!res.additionalInfo[key]) {
                                        res.additionalInfo[key] = "";
                                    }
                                })
                                res.formValue = {...res.formValue, ...res.additionalInfo};
                            }

                            if(req.body.isRevoke){
                                res.formValue.backgroundImg = background_cancelled;
                                const certificateInfo = await bezaServiceGateway.getCertificateInfo(req.body.applicationId)
                                const certificateGenerateDate = dateTimeFormattor.getFormatDate(certificateInfo.createdAt)
                                res.formValue.certificateGenerateDate = certificateGenerateDate;
                                res.formValue.validTill = dateTimeFormattor.getValidTillDate(certificateGenerateDate);
                            }
                            else{
                                res.formValue.backgroundImg = res.sopCode !== 'VISA_ASSISTANCE' ? background_image : '';
                                const certificateGenerateDate = dateTimeFormattor.getFormatDate(new Date(res.approvalDate))
                                res.formValue.certificateGenerateDate = certificateGenerateDate;
                                res.formValue.validTill = dateTimeFormattor.getValidTillDate(certificateGenerateDate)
                            }
                            res.formValue.trackingId = res.trackingId;
                            res.formValue.applicationDate = dateTimeFormattor.getApplicationDate(new Date(res.submittedDate).toLocaleDateString());

                            res.formValue.lastAmendmentDate = res.formValue.hasOwnProperty('lastAmendmentDate') ?
                                             "Amendment date : "+ dateTimeFormattor.getFormatDate(res.formValue.lastAmendmentDate) : " ";                     
                            
                            /**
                             * merging the common fields
                             */
                            const commonFieldValue=await bezaServiceGateway.getCommonFileds(req.body.investorId);
                            let commonFieldValueKeys = Object.keys(commonFieldValue);
                            commonFieldValueKeys.forEach(key=>{
                                // console.log("key:     "+key)
                                if(key=="dataGrid1"){
                                    // console.log("\n\n\n"+commonFieldValue[key].length+"\n\n\n")
                                }
                                if(commonFieldValue[key]!=null && !res.formValue.hasOwnProperty(key)){
                                    res.formValue[key] = commonFieldValue[key]
                                }
                            })
                            const deskUserSignature = await bezaServiceGateway.getdeskUserSignature(req.body.processInstanceId,"RD_3");
                            // console.log("\n\n\n\n\n\ndeskUserSignature Base64:   "+deskUserSignature.toString());
                            res.formValue.deskUserFullName =  deskUserSignature?.name || '-';
                            res.formValue.deskUserDesignation =  deskUserSignature?.designation || '-';
                            if(deskUserSignature && deskUserSignature.signature)
                            {
                                res.formValue.deskUserSignature = `<img width="50%" src="data:image/png;base64,${deskUserSignature.signature}" alt="" />`//deskUserSignature.signature;
                            }
                            else{
                                res.formValue.deskUserSignature='<p class="no-image">-</p>'
                            }

                            if(req.body.isProjectRegistration) {
                                res.sopCode = AllSopsCodes.PROJECT_REGISTRATION.value;
                            }
                            userSopById = res;
                            bufferResponse = await certificateGeneratorFactory.generate(res);
                            return bufferResponse;
                        }
                    ).then(
                        async (buffer) => {
                            certificateDetail = await bezaServiceGateway.upload(buffer, userSopById, req.body.isProjectRegistration);
                            return certificateDetail;
                        }
                    ).then(
                        async(certificate) => {
                            let isProjectRegistration = req.body.isProjectRegistration || false;
                            // response = await bezaServiceGateway.saveCertificateInfo (certificateDetail, userSopById, req.body.processInstanceId, req.body.isRevoke, isProjectRegistration, req.body.isRegenerated);
                            response = await bezaServiceGateway.saveCertificateInfo (certificateDetail, userSopById, req.body, isProjectRegistration);
                            // logger("response", response);
                            return response;
                        }
                    );
    return response;
}



module.exports = {
    generateCertificate,
}