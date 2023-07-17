const express = require('express');
const generatePdf = require('./generatePdf');
const generatePaymentVoucherPdf = require('./generatePaymentVoucherPdf');
const AppError = require('../../../util/appError');

const router = express.Router();

router.use("/generate/pdf", generatePdf);
router.use("/generate/payment-voucher/pdf", generatePaymentVoucherPdf);

router.all("*", (req, res, next) => {
    const err = new AppError(`${req.path} not available`, 405);
    next(err);
})

module.exports = router;