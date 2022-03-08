const bezaServiceGateway = require("./gateway_services/bezaServiceGateway");
const certificateGeneratorFactory = require('../services/certificateGeneratorFactory');
const dateTimeFormattor = require('../util/dateTimeFormattor');
const JsBarcode = require('jsbarcode')
var QRCode = require('qrcode')
const { DOMImplementation, XMLSerializer } = require('xmldom');
const xmlSerializer = new XMLSerializer();
const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
const config = require("../config/config");
const fs = require("fs");
const encryption = require("../util/encryption");
const background_image = fs.readFileSync('./pdf_templates/background_image.html',"utf8");
const background_cancelled = fs.readFileSync('./pdf_templates/background_cancelled.html',"utf8");
// const Cryptr = require("cryptr");
// const cryptr = new Cryptr(process.env.SECRET_KEY);
// Server will call this File
// bezaservicegateway
// method(sopCode)
//   let certificateGenerator = factoryMethod(sopCode);



//   bezaservicegateway.getFormValue()
//     .then(formValue => {
//         return certificateGenerator.generate(formvalue);
//     })
//     .then(buffer => {
//         return bezaservicegateway.upload();
//     })
//     .then( url => {
//         return bezaservicegateway.saveCertificateInfo
//     });


const generateQR = async text => {
    try {
    return await QRCode.toDataURL(text);
    } catch (err) {
      console.error(err)
    }
  }

const generateBarcode = async text => {
    // JsBarcode(canvas, text, {
    //     width: 1,
    //     displayValue: false
    // })
    
    // const barcodeData = canvas.toDataURL('image/png')
    JsBarcode(svgNode, text, {
        xmlDocument: document,
        width: 0.25,
        height: 25,
        displayValue: false
    });
    
    const barcodeData = xmlSerializer.serializeToString(svgNode);
    // console.log(barcodeData);
    return barcodeData;
}

const generateCertificate = async (req) => {
    let userSopById;
    let bufferResponse;
    let certificateDetail;
    let response;

    await bezaServiceGateway
                    .getFormValueByApplicationID(req.body.applicationId).then(
                       async res=>{
                            const canvas = {}
                            const appId = encryption.encrypt(""+req.body.applicationId);
                           // req.body.applicationId;
                            // const encryptedUserSopId = cryptr.encrypt(appId);
                            // console.log(
                            //   "encryptedUserSopId:  " + encryptedUserSopId
                            // );
                            // console.log(
                            //   "decryptedUserSopId:  " +
                            //     cryptr.decrypt(encryptedUserSopId)
                            // );
                            colonOrNot = config.backendApi.bezaServiceFrontEndPort == "" ? "" : ":";
                            const url =
                              `${config.backendApi.bezaServiceBaseUrl}${colonOrNot}${config.backendApi.bezaServiceFrontEndPort}/validate-certificate?applicationId=` +
                              appId;
                            
                            
                            await generateQR(url).then(qrRes=> res.formValue.qrcode = qrRes).catch(err=> console.log(err));

                            await generateBarcode(res.trackingId).then (barRes => res.formValue.barcode = barRes).catch(err=> console.log(err));
                            
                            if(req.body.isRevoke){
                                res.formValue.backgroundImg = background_cancelled;
                            }
                            else{
                                res.formValue.backgroundImg = background_image;
                            }
                            res.formValue.trackingId = res.trackingId;
                            res.formValue.applicationDate = dateTimeFormattor.getApplicationDate(res.createdAt);
                            userSopById = res;
                            /**
                             * merging the common fields
                             */
                            const commonFieldValue=await bezaServiceGateway.getCommonFileds(req.body.investorId);
                            console.log("\n\n\n\n\n\ncommonFieldValue:   "+JSON.stringify(commonFieldValue))
                            let commonFieldValueKeys = Object.keys(commonFieldValue);
                            console.log("\n\n\n\n\n\ncommonFieldValueKeys:   "+commonFieldValueKeys.toString())
                            commonFieldValueKeys.forEach(key=>{
                                console.log("key:     "+key)
                                if(key=="dataGrid1"){
                                    console.log("\n\n\n"+commonFieldValue[key].length+"\n\n\n")
                                }
                                if(commonFieldValue[key]!=null && !Object.keys(res.formValue).includes(key)){
                                    res.formValue[key] = commonFieldValue[key]
                                } 
                            })

                            bufferResponse = await certificateGeneratorFactory.generate(res);
                            return bufferResponse;
                        }
                    ).then(
                        async (buffer) => {
                            certificateDetail = await bezaServiceGateway.upload(buffer, userSopById);
                            return certificateDetail;
                        }
                    ).then(
                        async(certificate) => {
                            response = await bezaServiceGateway.saveCertificateInfo (certificateDetail, userSopById, req.body.processInstanceId, req.body.isRevoke);
                            return response;
                        }
                    );
    return response;
}




module.exports = {
    generateCertificate,
}