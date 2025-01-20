const express = require('express');
const privateRoutes = require('./Apis/private');
const internalRoutes = require('./Apis/internal');
const { authenticate } = require('../../services/authentication_service');

const router = express.Router();

router.use('/private',authenticate, privateRoutes);
router.use('/internal', internalRoutes);

module.exports = router;