const config = require('../config/config');

const cdrAnalysisReportRequestUrl = config.backendApi.bezaServiceBaseUrl +':' 
                                    +config.backendApi.bezaServicePort 
                                    +config.backendApi.analysisRequestServicePath;

const keyckloakUserInfoUrl = config.backendApi.keycloakBaseUrl + ":"
                                + config.backendApi.keycloakPort
                                + config.backendApi.keycloakUserInfoPath;

module.exports = {
    cdrAnalysisReportRequestUrl,
    keyckloakUserInfoUrl
}