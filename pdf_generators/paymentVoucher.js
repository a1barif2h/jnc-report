const fs = require("fs")
const pdf = require("./PdfGenerator")
const { getFormatDateWithTime } = require("../util/dateTimeFormattor");
const logger = require("../util/logger");

const options = {format: 'A4', "orientation": "portrait"};

// if (process.env.NODE_ENV !== "production") {
    options.childProcessOptions = {
        env: {
            OPENSSL_CONF: '/dev/null',
        },
    }
//   }

class PaymentVoucher {
    constructor(){};

    async generate(body){
        let htmlTemplate;

        body.downloadTime = getFormatDateWithTime(new Date());

        logger.info("paymentInfo %o", body)

        if(!body.applicationFee) {
            //This application fee comes from payment initiator info which is not present for legacy applications
            // as a quick fix we are adding the payAmount which includes vat in the application fee.
            body.applicationFee = body.payAmount;
        }

        if (body.paymentMode === 'A01' && body.paymentStatus.toLowerCase() === 'pending') {
            htmlTemplate = fs.readFileSync('./pdf_templates/payment-voucher/A01-pending.html', 'utf8');
        } else if(body.paymentMode === 'A01' && body.paymentStatus.toLowerCase() === 'paid') {
            htmlTemplate = fs.readFileSync('./pdf_templates/payment-voucher/A01-paid.html', 'utf8');
        } else {
            htmlTemplate = fs.readFileSync('./pdf_templates/payment-voucher/payment-voucher.html', 'utf8');
        }
        
        const response = await pdf.generatePdfFromHtmlForPayment(htmlTemplate, body, options);
        return response;
    }

    async generateInvestorVoucher(body){
        let htmlTemplate;

        body.downloadTime = getFormatDateWithTime(new Date());

        logger.info("paymentInfo %o", body)

        if(!body.applicationFee) {
            //This application fee comes from payment initiator info which is not present for legacy applications
            // as a quick fix we are adding the payAmount which includes vat in the application fee.
            body.applicationFee = body.payAmount;
        }

        if (body.paymentMode === 'A01' && body.paymentStatus.toLowerCase() === 'pending') {
            htmlTemplate = fs.readFileSync('./pdf_templates/payment-voucher-investor/A01-pending.html', 'utf8');
        } else if(body.paymentMode === 'A01' && body.paymentStatus.toLowerCase() === 'paid') {
            htmlTemplate = fs.readFileSync('./pdf_templates/payment-voucher-investor/A01-paid.html', 'utf8');
        } else {
            htmlTemplate = fs.readFileSync('./pdf_templates/payment-voucher-investor/payment-voucher.html', 'utf8');
        }
        
        const response = await pdf.generatePdfFromHtmlForPayment(htmlTemplate, body, options);
        return response;
    }
}

module.exports = PaymentVoucher;