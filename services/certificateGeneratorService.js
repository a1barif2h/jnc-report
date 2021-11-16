const bezaServiceGateway = require("./gateway_services/bezaServiceGateway");
const certificateGeneratorFactory = require('../services/certificateGeneratorFactory')

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

const generateCertificate = async (req) => {
    let userSopById;
    let bufferResponse;
    let certificateDetail;
    let response;
    await bezaServiceGateway
                    .getFormValueByApplicationID(req.body.applicationId).then(
                        res=>{
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
                            response = await bezaServiceGateway.saveCertificateInfo (certificateDetail, userSopById);
                            return response;
                        }
                    );
    return response;
}

module.exports = {
    generateCertificate
}