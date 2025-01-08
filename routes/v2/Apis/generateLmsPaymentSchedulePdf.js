const express = require("express");
const logger = require("../../../util/logger");
const PcApplication = require("../../../puppeteer_pdf_generators/PcApplication");
const LmsPaymentSchedule = require("../../../puppeteer_pdf_generators/LmsPaymentSchedule");

const router  = express.Router();

const generateLmsPaymentSchedulePdf = async (req, res) => {
    const lmsPaymentSchedule = new LmsPaymentSchedule();

    logger.info('start to generate lms payment schedule pdf');

    try {
        const pdfBuffer = await lmsPaymentSchedule.generate(req.body);

        res.setHeader('content-type', 'application/pdf');
        res.status(200).send(pdfBuffer);
    } catch (err) {
        logger.error(err);
        res.status(500).send('Error generating PDF');
    }
};




router.post("/", generateLmsPaymentSchedulePdf);

module.exports = router;