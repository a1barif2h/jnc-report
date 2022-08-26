const axios = require('axios');
// const { keyckloakUserInfoUrl } = require('../constants/backend_url');
const { config } = require('../config/config');
const logger = require('../util/logger');

async function authenticate(req, res, next) {
    const accessToken = req.headers.authorization;
    if(accessToken) {
        // console.log("Have access token");
        logger.info("Have access token")

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

        const response = await axios(options)
                            .then(res => {
                                // console.log("Got response from keycloak with status: " + res);
                                logger.info("Got response from keycloak with status: %s data: %s:", res, res.data)
                                return res;
                            })
                            .catch(err => {
                                logger.error('Invalid token: ');
                                logger.error(err);
                                return err.response;
                            });

        if(response.status == 200) {
            next();
        } else {
            // there is no token, don't process request further
            logger.error(`unauthorized user`)
            res.status(401).json({
                message: `unauthorized user`,
            });
        }
    }
    else {
    // there is no token, don't process request further
    logger.error(`unauthorized user`)
    res.status(401).json({
        message: `unauthorized user`,
      });
    }
}

module.exports.authenticate = authenticate;