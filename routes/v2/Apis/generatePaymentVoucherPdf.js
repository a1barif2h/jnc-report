const express = require("express");
const { PaymentVoucher } = require("../../../puppeteer_pdf_generators");
const { getPaymentVoucherInfo } = require("../../../services/gateway_services/bezaServiceGateway");
const logger = require("../../../util/logger");

const router  = express.Router();

const generatePaymentVoucherPdf = async (req, res) => {
    const paymentVoucher = new PaymentVoucher();
    const paymentInfo = await getPaymentVoucherInfo(req.body);
    const response = await paymentVoucher.generate(paymentInfo).then(res=>{return res}).catch(err=>{logger.error(err)})
    res.setHeader('content-type', 'application/pdf');
    res.status(200).send(response);
}


router.post("/", generatePaymentVoucherPdf);

module.exports = router;