const express = require('express');
const v2PrivateRoutes = require('./Apis/private');

const router = express.Router();

router.use('/private', v2PrivateRoutes);

module.exports = router;