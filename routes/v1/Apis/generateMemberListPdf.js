const express = require("express");
const logger = require("../../../util/logger");
const PcApplication = require("../../../puppeteer_pdf_generators/PcApplication");
const LmsPaymentSchedule = require("../../../puppeteer_pdf_generators/MemberList");
const MemberList = require("../../../puppeteer_pdf_generators/MemberList");

const router  = express.Router();

const generateMemberListPdf = async (req, res) => {
    const memberList = new MemberList();

    logger.info('start to generate member list pdf');

    try {
        const pdfBuffer = await memberList.generate(req.body);

        res.setHeader('content-type', 'application/pdf');
        res.status(200).send(pdfBuffer);
    } catch (err) {
        logger.error(err);
        res.status(500).send('Error generating PDF');
    }
};




router.post("/", generateMemberListPdf);

module.exports = router;