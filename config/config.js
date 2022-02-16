require('dotenv').config();
const convict = require('convict');

const config = convict({

    env: {
        format: ['production', 'staging', 'dev', 'default'],
        default: 'staging',
        arg: 'nodeEnv',
        env: 'NODE_ENV'
    }
});

const env = config.get('env');
console.log("env: " + env);
config.loadFile(`./config/${env}.json`);

module.exports = config.getProperties();
