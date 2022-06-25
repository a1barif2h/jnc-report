const fs = require("fs")
const pdf = require("./PdfGenerator")
// const { logger } = require('../util/helper');
const { getFormatDateWithTime } = require("../util/dateTimeFormattor");

const options = {format: 'A4', "orientation": "portrait"};

class PaymentVoucher {
    constructor(){};

    async generate(body){
        let htmlTemplate;

        body.downloadTime = getFormatDateWithTime(new Date());

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
}

module.exports = PaymentVoucher;