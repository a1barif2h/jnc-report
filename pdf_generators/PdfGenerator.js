
const pdf = require('html-pdf');
const puppeteer = require('puppeteer');
const templateEngine = require('../util/templateEngine');
const logger = require('../util/logger');

const pdfGenerator = function (htmlTemplate, json, res, options) {
  const html = templateEngine.replacer(htmlTemplate, json)
  pdf.create(html, options).toStream(function (err, stream) {
    if (err) return logger.error(err);
    stream.pipe(res);
  });
}

const generatePdfFromHtml = async function (htmlTemplate, json, options) {
  let html = templateEngine.replacer(htmlTemplate, json.formValue);
  html = html.replaceAll(`{{statusproposed2}}`, `{{userDesignation}}`);
  logger.info("Start replace key for: ", json.formValue.sopCode)
  html = templateEngine.replacer(html, json.formValue);
  const buf = await new Promise((resolve, reject) => {

    pdf.create(html, options).toBuffer(function (err, buffer) {
      if (err) {
        logger.error(err);
        return reject(err);
      }

      resolve(buffer);
    });
  });

  logger.info("Buffer ready")

  return buf;
}

const generatePdfFromHtmlForPayment = async function (htmlTemplate, data, options) {
  let html = templateEngine.replacer(htmlTemplate, data);
  html = templateEngine.replacer(html, data);
  const buf = await new Promise((resolve, reject) => {

    pdf.create(html, options).toBuffer(function (err, buffer) {
      if (err) {
        logger.error(err);
        return reject(err);
      }

      resolve(buffer);
    });
  });
  return buf;

}



const generatePdfFromHtmlMultipleMaterialDescription = async function (htmlTemplate, options) {
  const buf = await new Promise((resolve, reject) => {
    pdf.create(htmlTemplate, options).toBuffer(function (err, buffer) {
      if (err) {
        logger.error(err);
        return reject(err);
      }

      resolve(buffer);
    });
  });

  return buf;
};

const ejsPuppeteerPdfGenerator = async (generateTemplate, options, pageStyle) => {
  /**
   *! need to add executablePath when up service using Docker. And remove this line when working in locally

    {
      executablePath: "/usr/bin/google-chrome-stable",
      args: ["--no-sandbox"],
    }
  
   */
  const browser = await puppeteer.launch();
  const page = await browser.newPage();



  await page.setContent(generateTemplate, { waitUntil: "domcontentloaded" });
  await page.addStyleTag({
    content: pageStyle,
  });
  await page.emulateMediaType("screen");

  const generatedPdf = await page.pdf({
    ...options
  });

  await browser.close();

  return generatedPdf;
}



module.exports = {
  pdfGenerator,
  generatePdfFromHtml,
  generatePdfFromHtmlForPayment,
  generatePdfFromHtmlMultipleMaterialDescription,
  ejsPuppeteerPdfGenerator,
};