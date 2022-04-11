const axios = require("axios");
const config = require("../../config/config");
const { getCurrentFormattedDateTime } = require("../../util/dateTimeFormattor");
const FormData = require('form-data');
const { DOMImplementation, XMLSerializer } = require('xmldom');
const xmlSerializer = new XMLSerializer();
const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
const JsBarcode = require('jsbarcode');
const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

const getFormValueByApplicationID = async (applicationId) => {
  let formValueUrl =
    config.backendApi.bezaServiceBaseUrl +
    (config.backendApi.bezaServicePort == "" ? "" : (":" +
      config.backendApi.bezaServicePort)) +
    config.backendApi.bezaServiceGetFormValuesByApplicationIdPath +
    applicationId;
  
  console.log("URL to get from value from user sop: " + formValueUrl);
  let data = await axios
    .get(formValueUrl)
    .then(
      (response) => response.data
      // console.log(response.data);
      // console.log(response.data.explanation);
      //     const projectClearance = new ProjectClearance();
      // let generatedPdf = await projectClearance.generate(respose.data.formValue, req.body);
      // return generatedPdf;
    )
    .catch((error) => {
      console.log(error);
    });

  // console.log("Form value fetched under application ID: " + applicationId + " form: " + (data == null ? "null" : JSON.stringify(data) ));
  return data;
};

const upload = async (buffer, data) => {
  const uploadUrl =
    config.backendApi.bezaServiceBaseUrl +
    (config.backendApi.bezaServicePort == "" ? "" : (":" +
      config.backendApi.bezaServicePort)) +
    config.backendApi.mayanCertificateUploadPath;

  let pdfFileName = data.title + "_" + data.id + getCurrentFormattedDateTime() + ".pdf";
  
  console.log("pdfFileName:   "+pdfFileName)
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
    
  // console.log(buffer);
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
    
  console.log(res);
  return res;
}


const getCommonFileds= async function (investorId){
    const commonFiledsUrl =
    config.backendApi.bezaServiceBaseUrl+  ":" +
    config.backendApi.bezaServicePort+
    config.backendApi.bezaServiceCommmonFields+
    investorId

    console.log("commonFiledsUrl:   "+commonFiledsUrl)
    
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

  const a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
  const b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

  function inWords (num) {
      if ((num = num.toString()).length > 9) return 'overflow';
      n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
      if (!n) return; var str = '';
      str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
      str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
      str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
      str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
      str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + '' : '';
      return str;
  }

  function amountInWords(num) {
    const capitalized = (words) => words.charAt(0).toUpperCase() + words.slice(1);
    if(String(num).split(".").length > 1) {
      const strNum = String(num)
      const strNumArr = strNum.split('.')
      return capitalized(inWords(Number(strNumArr[0])) + 'point ' +inWords(Number(strNumArr[1])) + 'only')
    }

    return capitalized(inWords(num) + 'only')
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
