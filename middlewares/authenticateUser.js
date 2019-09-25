const request = require('request');
const assign = require('lodash/assign');

/**
 * Authenticates the user before calling any microservices.
 * Authentication is done by calling the Authentication service
 * @param req
 * @param res
 * @param next
 */
module.exports.authenticateUser = (req, res, next) => {
    req.user = null;

    console.log('authenticateUser');
    const accessToken = req.headers.authorization;

    console.log(accessToken);

    const options = {
        url: `http://lexio-authentication1:3010/api/users/me`,
        headers: {
            "authorization": accessToken
        }
    };

    request(options, (error, response, body) => {
        console.log(body);
        if(error) {
            res.status(500).send(error);
        }else {

            let json;
            try {
                json = JSON.parse(body);
            }catch (parsingError) {
                res.status(500).send(parsingError.message);
                return;
            }

            if (response.statusCode !== 200) {
                res.status(response.statusCode).send(json);
            }else{
                req.user = assign({}, json, {accessToken});
                next();
            }
        }
    });
};