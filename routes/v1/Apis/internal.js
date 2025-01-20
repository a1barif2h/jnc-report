const express = require('express');
const AppError = require('../../../util/appError');
const generateMemberListPdf = require('./generateMemberListPdf');

const router = express.Router();

router.use("/generate/memberList/pdf", generateMemberListPdf);

router.all("*", (req, res, next) => {
    const err = new AppError(`${req.path} not available`, 405);
    next(err);
})

module.exports = router;