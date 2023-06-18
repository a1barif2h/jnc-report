const express = require('express');
const v2PrivateRoutes = require('./Apis/private');
const { authenticate } = require('../../services/authentication_service');

const router = express.Router();

router.use('/private',authenticate, v2PrivateRoutes);

module.exports = router;