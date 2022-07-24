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
const { getCurrentFormattedDateTime, getFormatDate } = require("./util/dateTimeFormattor");
const PaymentVoucherService = require("./services/paymentVoucherService");
const { authenticate } = require("./services/authentication_service");
const corsOptions = {
  exposedHeaders: ["pdfFileName", "Content-disposition"],
};

// App
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use(cors(corsOptions));

app.get("/", (req, res) => {

  res.send({ msg: "ok"});
});

app.get("/server-date", (req, res) => {
  let queryParam = req.query.date;
  const queryParam2 = req.query.type;

  if(queryParam2) {
    queryParam = parseInt(queryParam);
  }
  const d = new Date(queryParam).toLocaleDateString();
  const t = new Date(queryParam).toLocaleTimeString();
  const vd = getFormatDate(d);


  res.send({ msg: "ok", date:d, time:t, vd });
});

app.get("/info", function (req, res) {
  const gitInfo = getRepoInfo();
  // console.log("checking health...");
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
  "/certificate-service/api/v1/private/generate/pdf",
  authenticate,
  async (req, res) => {
    await generateCertificate(req,res);

    //This is for test purpose
  //   res.setHeader("Content-Type", "application/json");
  // res.send(
  //   JSON.stringify({
  //     status: 200
  //   })
  // );
  }
);

app.post("/beza-certificate/api/v1/private/generate/payment-voucher/pdf", 
authenticate,
async (req, res) => {
  const paymentVoucherService = new PaymentVoucherService();
  await paymentVoucherService.generatePdf(req.body)
  .then(data => {
    res.setHeader('content-type', 'application/pdf');
    res.send(data)
  })
  .catch(err => res.send({message: 'ERROR'}))
});


app.post(
  "/certificate-service/api/v1/private/generate/pr-cert/pdf",
  async (req, res) => {
    await generateCertificate(req,res);
  }
);


const generateCertificate = async function(req,res) {
  const certificateService = new CertificateService();
  await certificateService
    .generatePdf(req)
    .then((data) => res.send(data))
    .catch((err) => res.send({ message: "ERR" }));
}



app.post(
  "/certificate-service/api/v1/internal/generate/pdf",
  async (req, res) => {
    await generateCertificate(req,res);
  }
);


app.post(
  "/certificate-service/api/v1/internal/generate/pr-cert/pdf",
  async (req, res) => {
    await generateCertificate(req,res);
  }
);


console.log(`Download service si running on http://${HOST}:${PORT}`);
app.listen(PORT, HOST);
