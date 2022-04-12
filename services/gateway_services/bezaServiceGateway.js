const axios = require("axios");
const config = require("../../config/config");
const { getCurrentFormattedDateTime } = require("../../util/dateTimeFormattor");
const FormData = require('form-data');
const { DOMImplementation, XMLSerializer } = require('xmldom');
const xmlSerializer = new XMLSerializer();
const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
const JsBarcode = require('jsbarcode');
const amountInWords = require("../../util/amountToWordUtil");
const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

const getFormValueByApplicationID = async (applicationId) => {
  let formValueUrl =
    config.backendApi.bezaServiceBaseUrl +
    (config.backendApi.bezaServicePort == "" ? "" : (":" +
      config.backendApi.bezaServicePort)) +
    config.backendApi.bezaServiceGetFormValuesByApplicationIdPath +
    applicationId;
  
  console.log("URL to get from value from user sop: " + formValueUrl);
  try {
    const {data} = await axios.get(formValueUrl)
    return data;
  } catch (error) {
    console.log(error)
  }
};

const upload = async (buffer, data) => {
  const uploadUrl =
    config.backendApi.bezaServiceBaseUrl +
    (config.backendApi.bezaServicePort == "" ? "" : (":" +
      config.backendApi.bezaServicePort)) +
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

const saveCertificateInfo = async (certificate, sop, processInstanceId, isRevoke) => {
  let model = {
    url: certificate.url,
    processInstanceId: processInstanceId,
    userSopId: sop.id,
    isValid: 1,
    isRevoked: isRevoke ? 1 : 0,
    documentId: certificate.id
  }

  const saveCertificateUrl =
    config.backendApi.bezaServiceBaseUrl +
    (config.backendApi.bezaServicePort == "" ? "" : (":" +
      config.backendApi.bezaServicePort)) +
    config.backendApi.bezaServiceGetCertificateInfoPath;

  

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
    config.backendApi.bezaServiceBaseUrl+  ":" +
    config.backendApi.bezaServicePort+
    config.backendApi.bezaServiceCommmonFields+
    investorId
    
   let res = await axios
   .get(commonFiledsUrl)
   .then((response) => response.data)
   .catch((error) => {
     console.log(error);
   });
   console.log("res[0].formValue:  "+JSON.stringify(res.userSopCommonFieldDomainModels[0].formValue))
   return res.userSopCommonFieldDomainModels[0].formValue;
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
    const totalFees = data?.payAmount + data?.vat + data?.bankCharge + data?.bankVat;
    data.totalFees = totalFees
    data.amountInWords = amountInWords(totalFees)
    await generateBarcode(data.trackingId).then (barRes => data.barcode = barRes).catch(err=> console.log(err));    
    return data;
  } catch (error) {
    console.log(error)
  }
}


module.exports = {
  getFormValueByApplicationID,
  upload,
  saveCertificateInfo,
  getCommonFileds,
  getPaymentVoucherInfo
};
