const express = require("express");
const logger = require("../../../util/logger");
const PcApplication = require("../../../puppeteer_pdf_generators/PcApplication");
const {config} = require("../../../config/config.js");
const { getPcApplicationPdf } = require("../../../services/gateway_services/bezaServiceGateway.js");
const {PDFDocument} = require('pdf-lib')

const router  = express.Router();

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

    try {
        const machineryInfoPdfBuffer = await pcApplication.generate(machineryInfo);
        const pcPdfBuffer = await getPcApplicationPdf(machineryInfo);

        const pcPdf = await PDFDocument.load(pcPdfBuffer);
        const machineryInfoPdf = await PDFDocument.load(machineryInfoPdfBuffer);

        const mergedPdf = await mergePDFs([pcPdf, machineryInfoPdf]);
        const mergedPdfBytes = await mergedPdf.save();
        const mergedPdfBuffer = Buffer.from(mergedPdfBytes)

        res.setHeader('content-type', 'application/pdf');
        res.status(200).send(mergedPdfBuffer);
    } catch (err) {
        logger.error(err);
        res.status(500).send('Error generating PDF');
    }
};

router.post("/", generatePcApplicationFullPdf);

module.exports = router;