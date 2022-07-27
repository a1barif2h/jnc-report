
import client from 'cloud-config-client';


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

console.log("Loading configuration for profile: " + activeProfile);
const cfg = await client.load(options).then((cfg) => {
//   console.log(cfg.toString(2));
  return cfg;
}).catch((error) => console.error(error));

console.log(cfg.get('spring.keycloak.user.role.add.url'));

export default cfg;