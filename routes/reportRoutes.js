const express = require("express");
const apiV1 = require('./v1/apiRoutes');

const router = express.Router();

router.use('/api/v1', apiV1);

module.exports = router;