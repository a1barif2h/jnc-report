const { response } = require("express");
const ProjectClearance = require("../pdf_generators/ProjectClearance");
const certificateGeneratorService = require('./certificateGeneratorService');
const config = require("../config/config");
const axios = require("axios");

class CertificateService {
  constructor() {}

  pdfFileName = "project-clearance";

  formValue = null;

  generatedPdf = null;
  

  getFormValue(req) {
    let formValueUrl =
      config.backendApi.bezaServiceBaseUrl +
      ":" +
      config.backendApi.bezaServicePort +
      config.backendApi.bezaServiceGetFormValuesByApplicationIdPath +
      req.body.applicationId;
    const data = axios
      .get(formValueUrl)
      .then((response) => response.data.formValue
        // console.log(response.data);
        // console.log(response.data.explanation);
    //     const projectClearance = new ProjectClearance();
    // let generatedPdf = await projectClearance.generate(respose.data.formValue, req.body);
    // return generatedPdf;
        
      )
      .catch((error) => {
        console.log(error);
      });

      console.log(data);
      return data;
  }

  async generatePdf(req) {
    // const certificateGeneratorService = new CertificateGeneratorService();
    const response = await certificateGeneratorService.generateCertificate(req).then(res=>{return res}).catch(err=>{console.log(err)});
    
    // console.log(response);
    return response;
    // const projectClearance = new CertificateGeneratorService();
    // let generatedPdf = await projectClearance.generate(res, req.body).then(
    //   res=>res,
    //   err=>err
    // );
    // return generatedPdf;
  }
}

module.exports = CertificateService;
