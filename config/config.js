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

let configProperties;

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
  application: 'beza-service',
  profiles: [process.env.NODE_ENV],
  endpoint: process.env.CONFIG_SERVER_URL,
  auth: {
    user: process.env.USER_NAME,
    pass:process.env.PASSWORD
  }
};

(async function loadCfg() {
    
    console.log("Loading configuration for profile: " + activeProfile);
    const cfg = await client.load(options).then((cfg) => {
        return cfg;
    }).catch((error) => console.error(error));
    configProperties = cfg;
    getBezaBaseUrl();
})();

function getBezaBaseUrl() {
    console.log("againnnnnnnnnnnnn");
    console.log(configProperties.get('spring.keycloak.user.role.add.url'));
}

module.exports = config.getProperties();
