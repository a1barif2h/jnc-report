const express = require('express');
const generatePdf = require('./generatePdf');
const generatePaymentVoucherPdf = require('./generatePaymentVoucherPdf');
const generatePcApplicationPdf = require('./generatePcApplicationPdf');
const generatePcApplicationFullPdf = require('./generatePcApplicationFullPdf');
const generateLmsPaymentSchedulePdf = require('./generateLmsPaymentSchedulePdf');
const AppError = require('../../../util/appError');

const router = express.Router();

router.use("/generate/pdf", generatePdf);
router.use("/generate/pr-cert/pdf", generatePdf);
router.use("/generate/payment-voucher/pdf", generatePaymentVoucherPdf);
router.use("/generate/pc-application/pdf", generatePcApplicationPdf);
router.use("/generate/pc-application/full-pdf", generatePcApplicationFullPdf);
router.use("/generate/lms-payment-schedule/pdf", generateLmsPaymentSchedulePdf);

router.all("*", (req, res, next) => {
    const err = new AppError(`${req.path} not available`, 405);
    next(err);
})

module.exports = router;