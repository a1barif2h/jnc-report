const axios = require('axios');
// const { keyckloakUserInfoUrl } = require('../constants/backend_url');
const { config } = require('../config/config');
const logger = require('../util/logger');

async function authenticate(req, res, next) {
    logger.info("Have access token?")
    const accessToken = req.headers.authorization;
    if(accessToken) {
        logger.info("YES")

        const keyckloakUserInfoUrl = config.KEYCLOAK_BASE_URL + ":" + config.KEYCLOAK_PORT + config.KEYCLOAK_USER_INFO_PATH;

    // configure the request to your keycloak server
        const options = {
                method: 'GET',
                url: keyckloakUserInfoUrl,
                headers: {
                // add the token you received to the userinfo request, sent to keycloak
                Authorization: accessToken,
            },
        };

        logger.info("Access Token Checking...")

        const response = await axios(options)
                            .then(res => {
                                logger.info("Token Accept")
                                logger.info("User info: %o", {
                                    name: res.data.name,
                                    userId: res.data.sub,
                                    email: res.data.email
                                })
                                return res;
                            })
                            .catch(err => {
                                logger.error('Invalid token:');
                                logger.error(err);
                                return err.response;
                            });

        if(response.status == 200) {
            next();
        } else {
            // there is no token, don't process request further
            logger.error(`Unauthorized user`)
            res.status(401).json({
                message: `unauthorized user`,
            });
        }
    }
    else {
    // there is no token, don't process request further
    logger.info("NO")
    logger.error("Unauthorized user")
    res.status(401).json({
        message: `Unauthorized user`,
      });
    }
}

module.exports.authenticate = authenticate;