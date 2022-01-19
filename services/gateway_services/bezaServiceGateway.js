const axios = require("axios");
const config = require("../../config/config");
const { getCurrentFormattedDateTime } = require("../../util/dateTimeFormattor");
const FormData = require('form-data');

const getFormValueByApplicationID = async (applicationId) => {
  let formValueUrl =
    config.backendApi.bezaServiceBaseUrl +
    ":" +
    config.backendApi.bezaServicePort +
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
    ":" +
    config.backendApi.bezaServicePort +
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
    
  // console.log(buffer);
  return res;

};

const saveCertificateInfo = async (certificate, sop, processInstanceId) => {
  let model = {
    url: certificate.url,
    processInstanceId: processInstanceId,
    userSopId: sop.id,
    isValid: true,
  }

  const saveCertificateUrl =
    config.backendApi.bezaServiceBaseUrl +
    ":" +
    config.backendApi.bezaServicePort +
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


module.exports = {
  getFormValueByApplicationID,
  upload,
  saveCertificateInfo
};
