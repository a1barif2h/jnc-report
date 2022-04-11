const fs = require("fs")
const pdf = require("./PdfGenerator")

const options = {format: 'A4', "orientation": "portrait"};

class PaymentVoucher {
    constructor(){};

    async generate(body){
        const htmlTemplate = fs.readFileSync('./pdf_templates/payment-voucher/payment-voucher.html', 'utf8');
        const response = await pdf.generatePdfFromHtmlForPayment(htmlTemplate, body, options);
        return response;
    }
}

module.exports = PaymentVoucher;