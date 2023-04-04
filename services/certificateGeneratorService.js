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
const logger = require("../util/logger");
const { getLoggerInfoText } = require("../util/utils");
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
    logger.info("Sending request for form value by application id: %s", req.body.applicationId);
    let sopCode;
    let isCancellation;
    
    await bezaServiceGateway
                    .getFormValueByApplicationID(req.body.applicationId).then(
                       async res=>{
                            logger.info("Request success, application tracking id: %s", res.trackingId)
                            const appId = encryption.encrypt(""+req.body.applicationId);
                            
                            colonOrNot = config.BEZA_FRONT_END_PORT == "" ? "" : ":";
                            const url =
                              `${config.BEZA_FRONT_END_BASE_URL}${colonOrNot}${config.BEZA_FRONT_END_PORT}/validate-certificate?applicationId=` +
                              appId;
                            await generateQR(url).then(qrRes=> res.formValue.qrcode = qrRes).catch(err=> logger.error(err));
                            await generateBarcode(res.trackingId).then (barRes => res.formValue.barcode = barRes).catch(err=> logger.error(err));

                            if (res.additionalInfo !== null && (res.sopCode === AllSopsCodes.OCCUPANCY.value || res.sopCode === AllSopsCodes.BUILDING_PERMIT.value)) {
                                logger.info("Start insert additional info in the form value for occupancy sop")
                                let inspectionDate = res?.additionalInfo?.inspectionDate;
                                let meetingDate = res?.additionalInfo?.meetingDate;

                                if(inspectionDate) {
                                    inspectionDate = new Date(inspectionDate).toLocaleDateString()
                                    res.additionalInfo.inspectionDate = inspectionDate 
                                    ? dateTimeFormattor.getFormatDate(inspectionDate) : " ";
                                }
                                if(meetingDate) {
                                    meetingDate = new Date(meetingDate).toLocaleDateString()
                                    res.additionalInfo.meetingDate = meetingDate 
                                    ? dateTimeFormattor.getFormatDate(meetingDate) : " ";
                                }
                                Object.keys(res.additionalInfo).map((key) => {
                                    if (!res.additionalInfo[key]) {
                                        res.additionalInfo[key] = "";
                                    }
                                })
                                res.formValue = {...res.formValue, ...res.additionalInfo};
                                logger.info("Insertion done.")
                            }

                            if(res.isCancellation) {
                                logger.info("Request for certificate cancellation, set cancellation background.")
                                res.formValue.backgroundImg = background_cancelled;
                                const certificateGenerateDate = dateTimeFormattor.getFormatDate(new Date(res.parentApprovalDate));
                                res.formValue.certificateGenerateDate = certificateGenerateDate;
                                res.formValue.validTill = dateTimeFormattor.getValidTillDate(certificateGenerateDate);
                                res.formValue.cancellationDate = res.hasOwnProperty('approvalDate') ?
                                             ("Cancellation Date : "+ dateTimeFormattor.getFormatDate(res.approvalDate)) : " ";
                            }
                            else if(req.body.isRevoke){
                                logger.info("Request for certificate revoke, set revoke background.")
                                res.formValue.backgroundImg = background_cancelled;
                                const certificateInfo = await bezaServiceGateway.getCertificateInfo(req.body.applicationId)
                                const certificateGenerateDate = dateTimeFormattor.getFormatDate(certificateInfo.createdAt)
                                res.formValue.certificateGenerateDate = certificateGenerateDate;
                                res.formValue.validTill = dateTimeFormattor.getValidTillDate(certificateGenerateDate);
                                res.formValue.cancellationDate = " ";
                            }
                            else{
                                logger.info("Request for general certificate")
                                res.formValue.backgroundImg = res.sopCode !== 'VISA_ASSISTANCE' && res.sopCode !== "ROYALTY_FEE" && res.sopCode !== "TECHNICAL_KNOW_HOW_FEE" ? background_image : '';
                                const certificateGenerateDate = dateTimeFormattor.getFormatDate(new Date(res.approvalDate))
                                res.formValue.certificateGenerateDate = res.formValue.hasOwnProperty('lastAmendmentDate') 
                                                                        ? dateTimeFormattor.getFormatDate(res.formValue.lastAmendmentDate)
                                                                        : certificateGenerateDate;
                                res.formValue.validTill = res.formValue.hasOwnProperty('lastAmendmentDate')
                                                            ? dateTimeFormattor.getValidTillDate(res.formValue.lastAmendmentDate)
                                                            : dateTimeFormattor.getValidTillDate(certificateGenerateDate);
                                res.formValue.cancellationDate = " ";
                            }
                            res.formValue.trackingId = res.trackingId;
                            res.formValue.applicationDate = dateTimeFormattor.getApplicationDate(new Date(res.submittedDate).toLocaleDateString());

                                                 

                            if(res.sopCode === "ROYALTY_FEE" || res.sopCode === "TECHNICAL_KNOW_HOW_FEE") {
                                res.formValue.lastAmendmentDate = res.formValue.hasOwnProperty('lastAmendmentDate') ?
                                '<div class="content-info"><p class="content-label">Amendment Date:</p><p class="content-value">'+dateTimeFormattor.getFormatDate(res.approvalDate)+'</p></div>' : ' ';
                            } else {
                                res.formValue.lastAmendmentDate = res.formValue.hasOwnProperty('lastAmendmentDate') ?
                                             "Amendment date : "+ dateTimeFormattor.getFormatDate(res.approvalDate) : " ";
                            }
                            
                            /**
                             * merging the common fields
                             */
                            logger.info("Sending request for common fields for investor id: %s",req.body.investorId)
                            const commonFieldValue=await bezaServiceGateway.getCommonFileds(req.body.investorId);
                            let commonFieldValueKeys = Object.keys(commonFieldValue);
                            commonFieldValueKeys.forEach(key=>{
                                if(key=="dataGrid1"){
                                }
                                if(commonFieldValue[key]!=null && !res.formValue.hasOwnProperty(key)){
                                    res.formValue[key] = commonFieldValue[key]
                                }
                            })
                            logger.info("Sending request for desk user signature: %s",getLoggerInfoText(req.body))
                            const deskUserSignature = await bezaServiceGateway.getdeskUserSignature(req.body.processInstanceId,"RD_3");
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
                            sopCode = res.sopCode;
                            isCancellation = res.isCancellation;
                            bufferResponse = await certificateGeneratorFactory.generate(res);
                            return bufferResponse;
                        }
                    ).then(
                        async(buffer) => {
                            let isProjectRegistration = req.body.isProjectRegistration || false;
                            // response = await bezaServiceGateway.saveCertificateInfo (certificateDetail, userSopById, req.body.processInstanceId, req.body.isRevoke, isProjectRegistration, req.body.isRegenerated);
                            // response = await bezaServiceGateway.saveCertificateInfo (certificateDetail, userSopById, req.body, isProjectRegistration);
                            response = await bezaServiceGateway.uploadAndSave(buffer, userSopById.id, req.body.processInstanceId,
                                req.body.isRevoke, req.body.isRegenerated, sopCode, userSopById.title, req.body.investorId,
                                isProjectRegistration, isCancellation);
                            // logger("response", response);
                            return response;
                        }
                    );
                    // .then(
                    //     async (buffer) => {
                    //         certificateDetail = await bezaServiceGateway.upload(buffer, userSopById, req.body.isProjectRegistration);
                    //         return certificateDetail;
                    //     }
                    // ).then(
                    //     async(certificate) => {
                    //         let isProjectRegistration = req.body.isProjectRegistration || false;
                    //         // response = await bezaServiceGateway.saveCertificateInfo (certificateDetail, userSopById, req.body.processInstanceId, req.body.isRevoke, isProjectRegistration, req.body.isRegenerated);
                    //         response = await bezaServiceGateway.saveCertificateInfo (certificateDetail, userSopById, req.body, isProjectRegistration);
                    //         // logger("response", response);
                    //         return response;
                    //     }
                    // );
    return response;
}

module.exports = {
    generateCertificate,
}