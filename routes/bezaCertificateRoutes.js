const express = require("express");
const apiV2 = require('./v2/apiRoutes');

const router = express.Router();

router.use('/api/v2', apiV2);

module.exports = router;