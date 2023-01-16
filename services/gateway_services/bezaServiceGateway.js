const axios = require("axios");
const {config} = require("../../config/config.js");
const { getCurrentFormattedDateTime } = require("../../util/dateTimeFormattor");
const FormData = require('form-data');
const { DOMImplementation, XMLSerializer } = require('xmldom');
const xmlSerializer = new XMLSerializer();
const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
const JsBarcode = require('jsbarcode');
const logger = require("../../util/logger/index.js");
const { amountInWords } = require("../../util/amountToWordUtil.js");
const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');


const getBaseUrl = () => {
  const baseUrl = config.BEZA_SERVICE_BASE_URL +
  (config.BEZA_SERVICE_PORT == "" ? "" : (":" +
    config.BEZA_SERVICE_PORT));

  return baseUrl;
}


const getFormValueByApplicationID = async (applicationId) => {
  let formValueUrl =
    getBaseUrl() +
    config.BEZA_SERVICE_FORM_BY_APPLICATION_ID_PATH +
    applicationId;
  try {
    const {data} = await axios.get(formValueUrl)
    return data;
  } catch (error) {
    logger.error(error)
  }
};

const getMachenariesByApplicationID = async (applicationId) => {
  let formValueUrl =
    getBaseUrl() +
    config.BEZA_SERVICE_GET_MACHENARIES_PATH +
    applicationId;
  try {
    const {data} = await axios.get(formValueUrl)
    return data;
  } catch (error) {
    logger.error(error);

    return {};
  }
};



const upload = async (buffer, data, isProjectRegistration) => {
  const uploadUrl =
    getBaseUrl() +
    config.BEZA_SERVICE_MAYAN_UPLOAD_PATH;
  
  let title = isProjectRegistration ? "Project Registration" : data.title;
  let pdfFileName = title + "_" + data.id + getCurrentFormattedDateTime() + ".pdf";
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
      logger.error(error);
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
    config.BEZA_SERVICE_CERTIFICATE_INFO_PATH
    + additionalUrl;

  logger.info(`save certificate url: ${saveCertificateUrl}`)

   let res = await axios
    .post(saveCertificateUrl, model)
    .then((response) => response.data)
    .catch((error) => {
      logger.error(error);
    });
  return res;
}


const getCommonFileds= async function (investorId){
    const commonFiledsUrl =
    getBaseUrl()+
    config.BEZA_SERVICE_COMMON_FIELDS_PATH+
    investorId
    logger.info(`URL to get from value from user sop: ${commonFiledsUrl}`)
    
   let res = await axios
   .get(commonFiledsUrl)
   .then((response) => response.data)
   .catch((error) => {
    logger.error(error);
   });
   return res.userSopCommonFieldDomainModels[0].formValue;
}

const getdeskUserSignature= async function (processInstanceId, deskCode){
  let signatureUrl = config.BEZA_SERVICE_DESK_USER_SIGNATURE_PATH;
  var deskUserSignatureUrl = signatureUrl+"?processInstanceId="+processInstanceId+"&deskCode="+deskCode;
    const bezaServiceDeskUserSignature =
    config.BEZA_SERVICE_BASE_URL+
    (config.BEZA_SERVICE_PORT == "" ? "" : (":" +
      config.BEZA_SERVICE_PORT))+
    deskUserSignatureUrl

    logger.info(`Getting signature name and designation api url: ${deskUserSignatureUrl} for process: ${processInstanceId} for desk: ${deskCode}`)
    
   let res = await axios
   .get(bezaServiceDeskUserSignature)
   .then((response) => {
      logger.info(`Got signature name and designation api url: ${deskUserSignatureUrl}`)
      // logger.info("response:%o", {...response.data}) 
      logger.info(`for process: ${processInstanceId}`)
      logger.info(`for desk: ${deskCode}`)
     return response.data;
   })
   .catch((error) => {
    logger.error(error);
   });
   return res;
  }
  
const getPaymentVoucherInfo = async ({applicationId}) => {
  const url = config.BEZA_SERVICE_BASE_URL+  (config.BEZA_SERVICE_PORT == "" ? "" : (":" +
  config.BEZA_SERVICE_PORT)) + config.BEZA_SERVICE_PAYMENT_VOUCHER_PATH + applicationId

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
    await generateBarcode(data.trackingId || "").then (barRes => data.barcode = barRes).catch(err=> logger.error(err));    
    return data;
  } catch (error) {
    logger.error(error);
  }
}

const getCertificateInfo = async (applicationId) => {
  const url = getBaseUrl()+ config.BEZA_SERVICE_CERTIFICATE_INFO_PATH + applicationId

  try {
    const {data} = await axios.get(url);
    return data
  } catch (error) {
    logger.error(error);
  }
}

const getConvertedCurrencyValue = async (quantity, source, target) => {
  const  port = (config.BEZA_SERVICE_PORT == "" ? "" : (":" +
  config.BEZA_SERVICE_PORT));
  const url = `${config.BEZA_SERVICE_BASE_URL}${port}${config.BEZA_SERVICE_CONVERT_CURRENCY_PATH}?q=${quantity}&source=${source}&target=${target}`;
  port
  try {
    const {data: {amount}} = await axios.get(url);
    return amount;
  } catch (error) {
    logger.error(error);
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
  getConvertedCurrencyValue,
  getMachenariesByApplicationID
};
