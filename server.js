"use strict";

const express = require("express");
const cors = require("cors");
var getRepoInfo = require("git-repo-info");
const axios = require("axios");

// Constants
const PORT = 5010;
const HOST = "0.0.0.0";
const VehicleRegistration = require("./pdf_generators/VehicleRegistration");
const ProjectClearance = require("./pdf_generators/ProjectClearance");
const CertificateService = require("./services/certificateService");
const { reportType } = require("./constants/reportTypes");
const config = require("./config/config");
const { getCurrentFormattedDateTime } = require("./util/dateTimeFormattor");
const PaymentVoucherService = require("./services/paymentVoucherService");
const corsOptions = {
  exposedHeaders: ["pdfFileName", "Content-disposition"],
};

// App
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  


  res.send({ msg: "ok" });
});

app.get("/info", function (req, res) {
  const gitInfo = getRepoInfo();
  console.log("checking health...");
  res.setHeader("Content-Type", "application/json");
  res.send(
    JSON.stringify({
      status: 200,
      branch: gitInfo.branch,
      sha: gitInfo.sha,
      commiter: gitInfo.committer,
      date: gitInfo.committerDate,
      message: gitInfo.commitMessage,
    })
  );
});

app.post(
  "/report-download/api/v1/private/vehicle-registration/print/pdf",
  (req, res) => {
    console.log("Printing vehicle-registration");
    let pdfFileName = "vehicle-registration";

    if (req.body && req.body.vehicleRegistrationNumber) {
      pdfFileName +=
        "_" +
        req.body.vehicleRegistrationNumber +
        getCurrentFormattedDateTime() +
        ".pdf";
    }
    res.setHeader("Content-disposition", "attachment; filename=" + pdfFileName); //file name should contain nid 10 digit
    res.setHeader("Content-type", "application/pdf");
    res.set("pdfFileName", pdfFileName);
    const vehicleRegistration = new VehicleRegistration();
    vehicleRegistration.generate(res, req.body);
  }
);

app.post(
  "/certificate-service/api/v1/private/generate/pdf",
  async (req, res) => {
    console.log("Printing pdf");
    const certificateService = new CertificateService();
    await certificateService
      .generatePdf(req)
      .then((data) => res.send(data))
      .catch((err) => res.send({ message: "ERR" }));
  }
);

app.post("/beza-certificate/api/v1/private/generate/payment-voucher/pdf", async (req, res) => {
  const paymentVoucherService = new PaymentVoucherService();
  await paymentVoucherService.generatePdf(req.body)
  .then(data => {
    res.setHeader('content-type', 'application/pdf');
    res.send(data)
  })
  .catch(err => res.send({message: 'ERROR'}))
})

console.log(`Download service si running on http://${HOST}:${PORT}`);
app.listen(PORT, HOST);
