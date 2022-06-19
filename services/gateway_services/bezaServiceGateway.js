const axios = require("axios");
const config = require("../../config/config");
const { getCurrentFormattedDateTime } = require("../../util/dateTimeFormattor");
const FormData = require('form-data');
const { DOMImplementation, XMLSerializer } = require('xmldom');
const xmlSerializer = new XMLSerializer();
const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
const JsBarcode = require('jsbarcode');
const amountInWords = require("../../util/amountToWordUtil");
const { logger } = require("../../util/helper");
const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');


const getBaseUrl = () => {
  const baseUrl = config.backendApi.bezaServiceBaseUrl +
  (config.backendApi.bezaServicePort == "" ? "" : (":" +
    config.backendApi.bezaServicePort));

  return baseUrl;
}


const getFormValueByApplicationID = async (applicationId) => {
  let formValueUrl =
    getBaseUrl() +
    config.backendApi.bezaServiceGetFormValuesByApplicationIdPath +
    applicationId;
  
  // console.log("URL to get from value from user sop: " + formValueUrl);
  try {
    const {data} = await axios.get(formValueUrl)
    return data;
  } catch (error) {
    console.log(error)
  }
};



const upload = async (buffer, data) => {
  const uploadUrl =
    getBaseUrl() +
    config.backendApi.mayanCertificateUploadPath;

  let pdfFileName = data.title + "_" + data.id + getCurrentFormattedDateTime() + ".pdf";
  let form = new FormData();
  form.append("file", buffer, pdfFileName);
  let res = await axios
    .post(uploadUrl, form, {
      headers: {
        "Content-Type": `multipart/form-data; boundary=${form._boundary}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    });
  return res;

};

const saveCertificateInfo = async (certificate, sop, req, isProjectRegistration) => {
  let model = {
    url: certificate.url,
    processInstanceId: req.processInstanceId,
    userSopId: sop.id,
    isValid: 1,
    isRevoked: req.isRevoke ? 1 : 0,
    documentId: certificate.id,
    isRegenerated: req.isRegenerated || false
  }
  let additionalUrl = isProjectRegistration ? "?isProjectRegistration=true" : ""
  const saveCertificateUrl =
    getBaseUrl() +
    config.backendApi.bezaServiceGetCertificateInfoPath
    + additionalUrl;


    

  console.log(saveCertificateUrl);

   let res = await axios
    .post(saveCertificateUrl, model)
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    });
  return res;
}


const getCommonFileds= async function (investorId){
    const commonFiledsUrl =
    getBaseUrl()+
    config.backendApi.bezaServiceCommmonFields+
    investorId

    console.log("URL to get from value from user sop: " + commonFiledsUrl);
    
   let res = await axios
   .get(commonFiledsUrl)
   .then((response) => response.data)
   .catch((error) => {
     console.log(error);
   });
  //  console.log("res[0].formValue:  "+JSON.stringify(res.userSopCommonFieldDomainModels[0].formValue))
   return res.userSopCommonFieldDomainModels[0].formValue;
}

const getdeskUserSignature= async function (processInstanceId, deskCode){
  let signatureUrl = config.backendApi.bezaServiceDeskUserSignature;
  var deskUserSignatureUrl = signatureUrl+"?processInstanceId="+processInstanceId+"&deskCode="+deskCode;
    const bezaServiceDeskUserSignature =
    config.backendApi.bezaServiceBaseUrl+
    (config.backendApi.bezaServicePort == "" ? "" : (":" +
      config.backendApi.bezaServicePort))+
    deskUserSignatureUrl

    // console.log("deskUserSignatureUrl:   "+bezaServiceDeskUserSignature)
    
   let res = await axios
   .get(bezaServiceDeskUserSignature)
   .then((response) => response.data)
   .catch((error) => {
     console.log(error);
   });
  //  console.log("res:  "+JSON.stringify(res))
   return res;
  }
  
const getPaymentVoucherInfo = async ({applicationId}) => {
  const url = config.backendApi.bezaServiceBaseUrl+  ":" +
  config.backendApi.bezaServicePort+ config.backendApi.paymentVoucherInfoPath + applicationId

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

  try {
    const {data} = await axios.get(url);
    data.amountInWords = amountInWords(data?.totalAmount)
    await generateBarcode(data.trackingId || "").then (barRes => data.barcode = barRes).catch(err=> console.log(err));    
    return data;
  } catch (error) {
    console.log(error)
  }
}

const getCertificateInfo = async (applicationId) => {
  const url = getBaseUrl()+ config.backendApi.certificateInfoPath + applicationId

  try {
    const {data} = await axios.get(url);
    return data
  } catch (error) {
    console.log(error)
  }
}

const getConvertedCurrencyValue = async (quantity, source, target) => {
  const url = `${config.backendApi.bezaServiceBaseUrl}:${config.backendApi.bezaServicePort}/beza-service/api/v1/private/currency/exchange/convert?q=${quantity}&source=${source}&target=${target}`;
  
  try {
    const {data: {amount}} = await axios.get(url);
    return amount;
  } catch (error) {
    console.log(error);
  }
}


module.exports = {
  getFormValueByApplicationID,
  upload,
  saveCertificateInfo,
  getCommonFileds,
  getPaymentVoucherInfo,
  getCertificateInfo,
  getdeskUserSignature,
  getConvertedCurrencyValue
};
