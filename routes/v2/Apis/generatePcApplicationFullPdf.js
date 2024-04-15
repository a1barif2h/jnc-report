const express = require("express");
const logger = require("../../../util/logger");
const PcApplication = require("../../../puppeteer_pdf_generators/PcApplication");
const { config } = require("../../../config/config.js");
const { getPcApplicationPdf, getMachenariesByApplicationID } = require("../../../services/gateway_services/bezaServiceGateway.js");
const { PDFDocument } = require('pdf-lib')

const router = express.Router();

const mergePDFs = async (pdfs) => {
  const mergedPdf = await PDFDocument.create();

  for (const pdf of pdfs) {
    const pdfBytes = await pdf.save();
    const existingPdf = await PDFDocument.load(pdfBytes);

    const pages = await mergedPdf.copyPages(existingPdf, existingPdf.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
  }

  return mergedPdf;
};

const generatePcApplicationFullPdf = async (req, res) => {
  const pcApplication = new PcApplication();
  const machineryInfo = req.body;
  const applicationId = machineryInfo?.applicationId;

  if (!applicationId) {
    return res.status(400).send('Application ID is required');
  }

  try {
    logger.info('start to get machinery info by application id')
    const machineryData = await getMachenariesByApplicationID(applicationId);
    logger.info('done getting machinery info by application id %s', JSON.stringify(machineryData))

    machineryInfo["additionOfMachinery"] = machineryData["additionOfMachinery"]

    logger.info('start to get machinery info pdf')
    const machineryInfoPdfBuffer = await pcApplication.generate(machineryInfo);
    logger.info('done machinery info pdf')

    logger.info('start to get main pdf')
    const pcPdfBuffer = await getPcApplicationPdf(machineryInfo);
    logger.info('done main pdf')

    logger.info('start to load machinery info pdf')
    const machineryInfoPdf = await PDFDocument.load(machineryInfoPdfBuffer);
    logger.info('done load machinery info pdf')

    logger.info('start to load main pdf')
    const pcPdf = await PDFDocument.load(pcPdfBuffer);
    logger.info('done load main pdf')


    logger.info('start to merge pdfs')
    const mergedPdf = await mergePDFs([pcPdf, machineryInfoPdf]);
    logger.info('done merging pdfs')

    logger.info('start to save merged pdf')
    const mergedPdfBytes = await mergedPdf.save();
    logger.info('done saving merged pdf')

    logger.info('start to convert merged pdf to buffer')
    const mergedPdfBuffer = Buffer.from(mergedPdfBytes)
    logger.info('done converting merged pdf to buffer')

    logger.info('start to set headers')
    const today = new Date().toDateString();
    const filename = `${machineryInfo?.trackingId}_${today}.pdf`


    res.setHeader('content-type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    logger.info('done setting headers')
    res.status(200).send(mergedPdfBuffer);
  } catch (err) {
    logger.error(err);
    res.status(500).send('Error generating PDF');
  }
};

router.post("/", generatePcApplicationFullPdf);

module.exports = router;