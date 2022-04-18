const { response } = require("express");
const ProjectClearance = require("../pdf_generators/ProjectClearance");
const certificateGeneratorService = require('./certificateGeneratorService');
const config = require("../config/config");
const axios = require("axios");

class CertificateService {
  constructor() {}
  
  getFormValue(req) {
    let formValueUrl =
      config.backendApi.bezaServiceBaseUrl +
      (config.backendApi.bezaServicePort == "" ? "" : (":" +
      config.backendApi.bezaServicePort)) +
      config.backendApi.bezaServiceGetFormValuesByApplicationIdPath +
      req.body.applicationId;
    const data = axios
      .get(formValueUrl)
      .then((response) => response.data.formValue)
      .catch((error) => {
        console.log(error);
      });

      // console.log(data);
      return data;
  }

  async generatePdf(req) {
    const response = await certificateGeneratorService.generateCertificate(req).then(res=>{return res}).catch(err=>{console.log(err)});
    return response;
  }

}

module.exports = CertificateService;
