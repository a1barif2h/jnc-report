const express = require('express');
const generatePdf = require('./generatePdf');
const AppError = require('../../../util/appError');

const router = express.Router();

router.use("/generate/pdf", generatePdf);

router.all("*", (req, res, next) => {
    const err = new AppError(`${req.path} not available`, 404);
    next(err);
})

module.exports = router;