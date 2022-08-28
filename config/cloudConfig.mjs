
import client from 'cloud-config-client';
import logger from '../util/logger';


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

logger.info(`Loading configuration for profile: ${activeProfile}`)
const cfg = await client.load(options).then((cfg) => {
  return cfg;
}).catch((error) => logger.error(error));

console.log(cfg.get('spring.keycloak.user.role.add.url'));

export default cfg;