const express = require("express");
const logger = require("../../../util/logger");
const PcApplication = require("../../../puppeteer_pdf_generators/PcApplication");

const router  = express.Router();

const generatePcApplicationPdf = async (req, res) => {
    const pcApplication = new PcApplication();
    const paymentInfo = req.body;

    try {
        const pdfBuffer = await pcApplication.generate(paymentInfo);

        res.setHeader('content-type', 'application/pdf');
        res.status(200).send(pdfBuffer);
    } catch (err) {
        logger.error(err);
        res.status(500).send('Error generating PDF');
    }
};




router.post("/", generatePcApplicationPdf);

module.exports = router;