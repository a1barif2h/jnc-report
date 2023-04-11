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
const logger = require("./util/logger");
const { getLoggerInfoText } = require("./util/utils");
const corsOptions = {
  exposedHeaders: ["pdfFileName", "Content-disposition"],
};

const bezaCertificateRoutes = require('./routes/bezaCertificateRoutes')

// App
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use(cors(corsOptions));

app.use('/ejs/certificate-service',authenticate, bezaCertificateRoutes);

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

app.post("/deoFileId", (req, res) => {
  const time = req.body.time

  setTimeout(() => {
    res.send({doeFileId: 2200516})
  }, time)
})

app.get("/info", function (req, res) {
  const gitInfo = getRepoInfo();
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
    logger.info("request : %s", getLoggerInfoText(req.body))
    await generateCertificate(req,res);
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

app.post("/test", (req, res) => {
  logger.info("request body : %o", req.body)
  res.json({id: 1})
})


logger.info(`Download service api running on http://${HOST}:${PORT}`);
app.listen(PORT, HOST);
