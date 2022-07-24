const { response } = require("express");
const ProjectClearance = require("../pdf_generators/ProjectClearance");
const certificateGeneratorService = require('./certificateGeneratorService');
const {config} = require("../config/config.js");
const axios = require("axios");

class CertificateService {
  constructor() {}
  
  getFormValue(req) {
    let formValueUrl =
      config.BEZA_SERVICE_BASE_URL+
      (config.BEZA_SERVICE_PORT == "" ? "" : (":" +
      config.BEZA_SERVICE_PORT)) +
      config.BEZA_SERVICE_FORM_BY_APPLICATION_ID_PATH +
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
