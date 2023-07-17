const fs = require("fs");
const logger = require("../util/logger");
const { ejsRender } = require("../util/templateEngine");
const { ejsPuppeteerPdfGenerator } = require("../pdf_generators/PdfGenerator");
const { getFormatDateWithTime } = require("../util/dateTimeFormattor");
const ejsUtils = require("../util/ejsUtils");

const options = {
  orientation: "portrait",
  printBackground: true,
  format: "A4",
  displayHeaderFooter: true,
  childProcessOptions: {
      env: {
          OPENSSL_CONF: '/dev/null',
      },
  }
};

class PaymentVoucher {
  constructor() {}

  async generate(body) {
    let initialTemplate;

    body.downloadTime = getFormatDateWithTime(new Date());
    body.utils = ejsUtils;

    logger.info("paymentInfo %o", body);

    if (!body.applicationFee) {
      //This application fee comes from payment initiator info which is not present for legacy applications
      // as a quick fix we are adding the payAmount which includes vat in the application fee.
      body.applicationFee = body.payAmount;
    }

    if (
      body.paymentMode === "A01" &&
      body.paymentStatus.toLowerCase() === "pending"
    ) {
      initialTemplate = fs.readFileSync(
        "./ejs_pdf_templates/payment-voucher/A01-pending.html",
        "utf8"
      );
    } else if (
      body.paymentMode === "A01" &&
      body.paymentStatus.toLowerCase() === "paid"
    ) {
      initialTemplate = fs.readFileSync(
        "./ejs_pdf_templates/payment-voucher/A01-paid.html",
        "utf8"
      );
    } else {
      initialTemplate = fs.readFileSync(
        "./ejs_pdf_templates/payment-voucher/payment-voucher.html",
        "utf8"
      );
    }
    const generateTemplate = ejsRender(initialTemplate, body);

    const pageStyle = `
      @page {
          margin-bottom: 40px;
      }
    `;

    options.footerTemplate = `<div  style="width: 100%;box-sizing: border-box;padding: 0px;display: flex;justify-content: space-between;padding:0 10px;font-size: 8px;color: black;">
    <p>Download time: ${body.downloadTime}</p>
    <p>Help line: 0178787878</p>
  </div>`

    const generatedPdf = ejsPuppeteerPdfGenerator(
      generateTemplate,
      options,
      pageStyle
    );

    return generatedPdf;
  }
}

module.exports = PaymentVoucher;
