require('dotenv').config();
const convict = require('convict');
const client = require('cloud-config-client');
const logger = require('../util/logger');

const configProperties = {
    BEZA_SERVICE_BASE_URL: "",
    BEZA_SERVICE_PORT: "",
    BEZA_FRONT_END_BASE_URL: "",
    BEZA_FRONT_END_PORT: "",
    BEZA_SERVICE_MAYAN_UPLOAD_PATH: "",
    BEZA_SERVICE_FORM_BY_APPLICATION_ID_PATH: "",
    BEZA_SERVICE_CERTIFICATE_INFO_PATH: "",
    BEZA_SERVICE_COMMON_FIELDS_PATH: "",
    BEZA_SERVICE_PAYMENT_VOUCHER_PATH: "",
    BEZA_SERVICE_CERTIFICATE_INFO_PATH: "",
    BEZA_SERVICE_DESK_USER_SIGNATURE_PATH: "",
    BEZA_SERVICE_CONVERT_CURRENCY_PATH: "",
    BEZA_SERVICE_GET_MACHENARIES_PATH: "",
    KEYCLOAK_BASE_URL: "",
    KEYCLOAK_PORT: "",
    KEYCLOAK_USER_INFO_PATH: "",
    BEZA_APPLICATION_PDF_SERVICE: ""
};

const config = convict({

    env: {
        format: ['production', 'staging', 'dev', 'default', 'staging_uat', 'production_local'],
        default: 'staging',
        arg: 'nodeEnv',
        env: 'NODE_ENV'
    }
});

const env = config.get('env');
config.loadFile(`./config/${env}.json`);

const activeProfile = process.env.NODE_ENV;

// Explicit basic auth
const options = {
  application: process.env.APPLICATION_NAME,
  profiles: [process.env.NODE_ENV],
  endpoint: process.env.CONFIG_SERVER_URL,
  auth: {
    user: process.env.USER_NAME,
    pass:process.env.PASSWORD
  }
};

const conf = config.getProperties();
configProperties.BEZA_SERVICE_BASE_URL = conf.backendApi.bezaServiceBaseUrl;
configProperties.BEZA_SERVICE_PORT = conf.backendApi.bezaServicePort;
configProperties.BEZA_FRONT_END_BASE_URL = conf.backendApi.bezaServiceFrontEndBaseUrl;
configProperties.BEZA_FRONT_END_PORT = conf.backendApi.bezaServiceFrontEndPort;
configProperties.BEZA_SERVICE_MAYAN_UPLOAD_PATH = conf.backendApi.mayanCertificateUploadPath;
configProperties.BEZA_SERVICE_FORM_BY_APPLICATION_ID_PATH = conf.backendApi.bezaServiceGetFormValuesByApplicationIdPath;
configProperties.BEZA_SERVICE_CERTIFICATE_INFO_PATH = conf.backendApi.bezaServiceGetCertificateInfoPath;
configProperties.BEZA_SERVICE_COMMON_FIELDS_PATH = conf.backendApi.bezaServiceCommmonFields;
configProperties.BEZA_SERVICE_PAYMENT_VOUCHER_PATH = conf.backendApi.paymentVoucherInfoPath;
configProperties.BEZA_SERVICE_CERTIFICATE_INFO_PATH = conf.backendApi.certificateInfoPath;
configProperties.BEZA_SERVICE_DESK_USER_SIGNATURE_PATH = conf.backendApi.bezaServiceDeskUserSignature;
configProperties.BEZA_SERVICE_GET_MACHENARIES_PATH = conf.backendApi.getMachineriesPath;
configProperties.BEZA_SERVICE_CONVERT_CURRENCY_PATH = conf.backendApi.convertCurrency;
configProperties.KEYCLOAK_BASE_URL = conf.backendApi.keycloakBaseUrl;
configProperties.KEYCLOAK_PORT = conf.backendApi.keycloakPort;
configProperties.KEYCLOAK_USER_INFO_PATH = conf.backendApi.keycloakUserInfoPath;
configProperties.BEZA_APPLICATION_PDF_SERVICE = conf.backendApi.bezaApplicationPdfServiceBaseUrl;


logger.info(`Loading configuration for profile: ${activeProfile}`)
logger.info('Loaded properties: %o', {...configProperties})


module.exports = {
    oldConfig: config.getProperties(),
    config: configProperties
};
