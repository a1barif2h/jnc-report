const express = require("express");
const fs = require("fs");

const logger = require("../../../util/logger");
const {
    getFormValueByApplicationID,
    getCertificateInfo,
    getCommonFileds,
    getdeskUserSignature,
    uploadAndSave,
} = require("../../../services/gateway_services/bezaServiceGateway");
const { encrypt } = require("../../../util/encryption");
const { config } = require("../../../config/config");
const {
    generateQR,
    generateBarcode,
} = require("../../../services/certificateGeneratorService");
const { AllSopsCodes } = require("../../../shared/constants/AllSopsCodes");
const {
    getFormatDate,
    getValidTillDate,
    getApplicationDate,
} = require("../../../util/dateTimeFormattor");
const { getLoggerInfoText } = require("../../../util/utils");
const puppeteerGeneratorFactory = require("../../../services/puppeteerCertificateFactory");

const background_image = fs.readFileSync(
    "./pdf_templates/background_image.html",
    "utf8"
);
const background_cancelled = fs.readFileSync(
    "./pdf_templates/background_cancelled.html",
    "utf8"
);

const router = express.Router();

const generatePdf = async (req, res, next) => {
    try {
        let userSopById;
        let bufferResponse;

        logger.info(
            "Sending request for form value by application id: %s",
            req.body.applicationId
        );
        let sopCode;
        let isCancellation;

        const response = await getFormValueByApplicationID(req.body.applicationId)
            .then(async (res) => {
                logger.info(
                    "Request success, application tracking id: %s, %o",
                    res.trackingId
                );
                const appId = encrypt("" + req.body.applicationId);

                colonOrNot = config.BEZA_FRONT_END_PORT == "" ? "" : ":";
                const url =
                    `${config.BEZA_FRONT_END_BASE_URL}${colonOrNot}${config.BEZA_FRONT_END_PORT}/validate-certificate?applicationId=` +
                    appId;

                await generateQR(url)
                    .then((qrRes) => (res.formValue.qrcode = qrRes))
                    .catch((err) => logger.error(err));
                await generateBarcode(res.trackingId)
                    .then((barRes) => (res.formValue.barcode = barRes))
                    .catch((err) => logger.error(err));

                if (
                    res.additionalInfo !== null &&
                    (res.sopCode === AllSopsCodes.OCCUPANCY.value ||
                        res.sopCode === AllSopsCodes.BUILDING_PERMIT.value)
                ) {
                    logger.info(
                        "Start insert additional info in the form value for occupancy sop"
                    );
                    let inspectionDate = res?.additionalInfo?.inspectionDate;
                    let meetingDate = res?.additionalInfo?.meetingDate;

                    if (inspectionDate) {
                        inspectionDate = new Date(inspectionDate).toLocaleDateString();
                        res.additionalInfo.inspectionDate = inspectionDate
                            ? getFormatDate(inspectionDate)
                            : " ";
                    }
                    if (meetingDate) {
                        meetingDate = new Date(meetingDate).toLocaleDateString();
                        res.additionalInfo.meetingDate = meetingDate
                            ? getFormatDate(meetingDate)
                            : " ";
                    }
                    Object.keys(res.additionalInfo).map((key) => {
                        if (!res.additionalInfo[key]) {
                            res.additionalInfo[key] = "";
                        }
                    });
                    res.formValue = { ...res.formValue, ...res.additionalInfo };
                    logger.info("Insertion done.");
                }

                if (res.isCancellation) {
                    logger.info(
                        "Request for certificate cancellation, set cancellation background."
                    );
                    res.formValue.backgroundImg = background_cancelled;
                    const certificateGenerateDate = getFormatDate(
                        new Date(res.parentApprovalDate)
                    );
                    res.formValue.certificateGenerateDate = certificateGenerateDate;
                    res.formValue.validTill = getValidTillDate(certificateGenerateDate);
                    res.formValue.cancellationDate = res.hasOwnProperty("approvalDate")
                        ? "Cancellation Date : " + getFormatDate(res.approvalDate)
                        : " ";
                } else if (req.body.isRevoke) {
                    logger.info("Request for certificate revoke, set revoke background.");
                    res.formValue.backgroundImg = background_cancelled;
                    const certificateInfo = await getCertificateInfo(
                        req.body.applicationId
                    );
                    const certificateGenerateDate = getFormatDate(
                        certificateInfo.createdAt
                    );
                    res.formValue.certificateGenerateDate = certificateGenerateDate;
                    res.formValue.validTill = getValidTillDate(certificateGenerateDate);
                    res.formValue.cancellationDate = " ";
                } else {
                    logger.info("Request for general certificate");
                    res.formValue.backgroundImg =
                        res.sopCode !== "VISA_ASSISTANCE" &&
                            res.sopCode !== "ROYALTY_FEE" &&
                            res.sopCode !== "TECHNICAL_KNOW_HOW_FEE"
                            ? background_image
                            : "";
                    const certificateGenerateDate = getFormatDate(
                        new Date(res.approvalDate)
                    );
                    res.formValue.certificateGenerateDate = res.formValue.hasOwnProperty(
                        "lastAmendmentDate"
                    )
                        ? getFormatDate(res.formValue.lastAmendmentDate)
                        : certificateGenerateDate;
                    res.formValue.validTill = res.formValue.hasOwnProperty(
                        "lastAmendmentDate"
                    )
                        ? getValidTillDate(res.formValue.lastAmendmentDate)
                        : getValidTillDate(certificateGenerateDate);
                    res.formValue.cancellationDate = " ";
                }

                res.formValue.trackingId = res.trackingId;
                res.formValue.applicationDate = getApplicationDate(
                    new Date(res.submittedDate).toLocaleDateString()
                );

                if (
                    res.sopCode === "ROYALTY_FEE" ||
                    res.sopCode === "TECHNICAL_KNOW_HOW_FEE"
                ) {
                    res.formValue.lastAmendmentDate = res.formValue.hasOwnProperty(
                        "lastAmendmentDate"
                    )
                        ? '<div class="content-info"><p class="content-label">Amendment Date:</p><p class="content-value">' +
                        getFormatDate(res.approvalDate) +
                        "</p></div>"
                        : " ";
                } else {
                    res.formValue.lastAmendmentDate = res.formValue.hasOwnProperty(
                        "lastAmendmentDate"
                    )
                        ? "Amendment date : " + getFormatDate(res.approvalDate)
                        : " ";
                }

                /**
                 * merging the common fields
                 */
                logger.info(
                    "Sending request for common fields for investor id: %s",
                    req.body.investorId
                );
                const commonFieldValue = await getCommonFileds(req.body.investorId);
                let commonFieldValueKeys = Object.keys(commonFieldValue);
                commonFieldValueKeys.forEach((key) => {
                    if (key == "dataGrid1") {
                    }
                    if (
                        commonFieldValue[key] != null &&
                        !res.formValue.hasOwnProperty(key)
                    ) {
                        res.formValue[key] = commonFieldValue[key];
                    }
                });
                logger.info(
                    "Sending request for desk user signature: %s",
                    getLoggerInfoText(req.body)
                );
                const deskUserSignature = await getdeskUserSignature(
                    req.body.processInstanceId,
                    "RD_3"
                );
                res.formValue.deskUserFullName = deskUserSignature?.name || "-";
                res.formValue.deskUserDesignation =
                    deskUserSignature?.designation || "-";
                if (deskUserSignature && deskUserSignature.signature) {
                    res.formValue.deskUserSignature = `<img width="50%" src="data:image/png;base64,${deskUserSignature.signature}" alt="" />`; //deskUserSignature.signature;
                } else {
                    res.formValue.deskUserSignature = '<p class="no-image">-</p>';
                }

                if (req.body.isProjectRegistration) {
                    res.sopCode = AllSopsCodes.PROJECT_REGISTRATION.value;
                }
                userSopById = res;
                sopCode = res.sopCode;
                isCancellation = res.isCancellation;
                bufferResponse = await puppeteerGeneratorFactory.generate(res);
                return bufferResponse;
            })
            .then(async (buffer) => {
                let isProjectRegistration = req.body.isProjectRegistration || false;
                const pdfData = await uploadAndSave(
                    buffer,
                    userSopById.id,
                    req.body.processInstanceId,
                    req.body.isRevoke,
                    req.body.isRegenerated,
                    sopCode,
                    userSopById.title,
                    req.body.investorId,
                    isProjectRegistration,
                    isCancellation
                );
                return pdfData;
            })
            .catch((err) => {
                logger.error(err);
                logger.error("error happened in generatePdf file, error");
                return err;
            });

        if (response && response.id) {
            res.status(200).send(response);
        } else {
            res.status(500).json({ msg: "Something happened wrong", error: response })
        }
    } catch (error) {
        next(error);
    }
};

router.post("/", generatePdf);

module.exports = router;
