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
    console.log(barcodeData);
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
                            const url =
                              `${config.backendApi.bezaServiceBaseUrl}:${config.backendApi.bezaServiceFrontEndPort}/validate-certificate?applicationId=` +
                              req.body.applicationId;
                            
                            
                            
                            await generateQR(url).then(qrRes=> res.formValue.qrcode = qrRes).catch(err=> console.log(err));

                            await generateBarcode(res.uuid).then (barRes => res.formValue.barcode = barcodeData = barRes).catch(err=> console.log(err));
                            
                            res.formValue.trackingId = res.uuid;
                            res.formValue.applicationDate = dateTimeFormattor.getApplicationDate(res.createdAt);
                            userSopById = res;
                            bufferResponse = certificateGeneratorFactory.generate(res);
                            return bufferResponse;
                        }
                    ).then(
                        async (buffer) => {
                            certificateDetail = await bezaServiceGateway.upload(buffer, userSopById);
                            return certificateDetail;
                        }
                    ).then(
                        async(certificate) => {
                            response = await bezaServiceGateway.saveCertificateInfo (certificateDetail, userSopById, req.body.processInstanceId);
                            return response;
                        }
                    );
    return response;
}

module.exports = {
    generateCertificate
}