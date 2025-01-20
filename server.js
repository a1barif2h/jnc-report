"use strict";
const express = require("express");
const cors = require("cors");

const PORT = 5010;
const HOST = "0.0.0.0";
const logger = require("./util/logger");
const corsOptions = {
  exposedHeaders: ["pdfFileName", "Content-disposition"],
};

const reportRoutes = require('./routes/reportRoutes')

// App
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use(cors(corsOptions));

app.use('/report-service', reportRoutes);



logger.info(`Download service api running on http://${HOST}:${PORT}`);
app.listen(PORT, HOST);
