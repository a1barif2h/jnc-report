require('dotenv').config();
const convict = require('convict');
const client = require('cloud-config-client');
// import dotenv from 'dotenv';
// import convict from 'convict';
// import client from 'cloud-config-client';

// cfgPromise.then(cf => {
//   console.log("In first then");
//   // console.log(cf);
// });
// dotenv.config();

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
    KEYCLOAK_BASE_URL: "",
    KEYCLOAK_PORT: "",
    KEYCLOAK_USER_INFO_PATH: ""
};

const config = convict({

    env: {
        format: ['production', 'staging', 'dev', 'default', 'staging_uat'],
        default: 'staging',
        arg: 'nodeEnv',
        env: 'NODE_ENV'
    }
});

// console.log(cfg);
const env = config.get('env');
console.log("env: " + env);
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
configProperties.BEZA_SERVICE_CONVERT_CURRENCY_PATH = conf.backendApi.convertCurrency;
configProperties.KEYCLOAK_BASE_URL = conf.backendApi.keycloakBaseUrl;
configProperties.KEYCLOAK_PORT = conf.backendApi.keycloakPort;
configProperties.KEYCLOAK_USER_INFO_PATH = conf.backendApi.keycloakUserInfoPath;

// (async function loadCfg() {
    
//     console.log("Loading configuration for profile: " + activeProfile);
//     await client.load(options)
//         .then((cfg) => {
//             configProperties.BEZA_SERVICE_BASE_URL = cfg.get('beza.service.base.url');
//             configProperties.BEZA_SERVICE_PORT = cfg.get('beza.service.base.port');
//             configProperties.BEZA_FRONT_END_BASE_URL = cfg.get('beza.service.front_end.base.url');
//             configProperties.BEZA_FRONT_END_PORT = cfg.get('beza.service.front_end.port');
//             configProperties.BEZA_SERVICE_MAYAN_UPLOAD_PATH = cfg.get('beza.service.mayan_upload.path');
//             configProperties.BEZA_SERVICE_FORM_BY_APPLICATION_ID_PATH = cfg.get('beza.service.form_value_by_application_id.path');
//             configProperties.BEZA_SERVICE_CERTIFICATE_INFO_PATH = cfg.get('beza.service.certificate_info.path');
//             configProperties.BEZA_SERVICE_COMMON_FIELDS_PATH = cfg.get('beza.service.commom_fields.path');
//             configProperties.BEZA_SERVICE_PAYMENT_VOUCHER_PATH = cfg.get('beza.service.payment_voucher_info.path');
//             configProperties.BEZA_SERVICE_CERTIFICATE_INFO_PATH = cfg.get('beza.service.certificate_info.path');
//             configProperties.BEZA_SERVICE_DESK_USER_SIGNATURE_PATH = cfg.get('beza.service.desk_user_signature.path');
//             configProperties.BEZA_SERVICE_CONVERT_CURRENCY_PATH = cfg.get('beza.service.convert_currency.path');
//             configProperties.KEYCLOAK_BASE_URL = cfg.get('keycloak.base.url');
//             configProperties.KEYCLOAK_PORT = cfg.get('keyloak.port');
//             configProperties.KEYCLOAK_USER_INFO_PATH = cfg.get('keyloak.user_info.path');
//         })
//         .catch((error) => console.error(error));

//     console.log("Loaded propertes: ");
//     console.log(configProperties);
// })();


console.log("Loading configuration for profile: " + activeProfile);
console.log("Loaded propertes: ");
console.log(configProperties);

module.exports = {
    oldConfig: config.getProperties(),
    config: configProperties
};
