const express = require('express');
const v2PrivateRoutes = require('./Apis/private');
const v2InternalRoutes = require('./Apis/internal');
const { authenticate } = require('../../services/authentication_service');

const router = express.Router();

router.use('/private',authenticate, v2PrivateRoutes);
router.use('/internal', v2InternalRoutes);

module.exports = router;