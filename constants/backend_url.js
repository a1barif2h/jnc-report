const config = require('../config/config');

const cdrAnalysisReportRequestUrl = config.backendApi.bezaServiceBaseUrl +':' 
                                    +config.backendApi.bezaServicePort 
                                    +config.backendApi.analysisRequestServicePath;

module.exports = {
    cdrAnalysisReportRequestUrl
}