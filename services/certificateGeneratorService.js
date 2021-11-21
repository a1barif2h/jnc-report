const bezaServiceGateway = require("./gateway_services/bezaServiceGateway");
const certificateGeneratorFactory = require('../services/certificateGeneratorFactory')
const JsBarcode = require('jsbarcode')
var QRCode = require('qrcode')
const { createCanvas } = require('canvas');
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

const generateCertificate = async (req) => {
    let userSopById;
    let bufferResponse;
    let certificateDetail;
    let response;

    await bezaServiceGateway
                    .getFormValueByApplicationID(req.body.applicationId).then(
                       async res=>{
                            const canvas = createCanvas()
                            const url = `${config.backendApi.bezaServiceBaseUrl}:${config.backendApi.bezaServiceFrontEndPort}/validate-certificate?applicationId=asasdfas`
                            JsBarcode(canvas, res.uuid, {
                                width: 1,
                                displayValue: false
                            })
                            
                            const barcodeData = canvas.toDataURL('image/png')
                            
                            
                            await generateQR(url).then(qrRes=> res.formValue.qrcode = qrRes).catch(err=> console.log(err));

                            res.formValue.barcode = barcodeData
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