const PaymentVoucher = require("../pdf_generators/paymentVoucher");
const logger = require("../util/logger");
const bezaServiceGateway = require("./gateway_services/bezaServiceGateway");

class PaymentVoucherService {
    constructor(){}

    async generatePdf(req) {
        const paymentVoucher = new PaymentVoucher()
        const paymentInfo = await bezaServiceGateway.getPaymentVoucherInfo(req)
        const response = await paymentVoucher.generate(paymentInfo).then(res=>{return res}).catch(err=>{logger.error(err)})
        return response;
      }
}

module.exports = PaymentVoucherService;