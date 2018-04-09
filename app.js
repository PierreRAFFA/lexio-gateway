const express = require('express');
const request = require('request');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const assign = require('lodash/assign');
const get = require('lodash/get');
const https = require('https');
const fs = require('fs');

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
const app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// use for the ssl
app.use(express.static('static'));

// Helmet.js helps secure Express servers through setting HTTP headers.
// It adds HSTS, removes the X-Powered-By header and sets the X-Frame-Options header
// to prevent click jacking, among other things. Setting it up is simple.
app.use(require('helmet')());

if (process.env.NODE_ENV === 'production') {
  const options = {
    key: fs.readFileSync('./ssl/privkey2.pem'),
    cert: fs.readFileSync('./ssl/cert2.pem'),
    ca: fs.readFileSync('./ssl/chain2.pem')

    // This is where the magic happens in Node.  All previous
    // steps simply setup SSL (except the CA).  By requesting
    // the client provide a certificate, we are essentially
    // authenticating the user.
    // requestCert: true,

    // If specified as "true", no unauthenticated traffic
    // will make it to the route specified.
    // rejectUnauthorized: true
  };

  const server = https.createServer(options, app).listen(3000, function(){
    console.log("Express server listening on port " + 3000);
  });

} else {

  app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
  });
}

//////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////// MIDDLEWARES

/**
 * Authenticates the user before calling any microservices.
 * Authentication is done by calling the Authentication service
 * @param req
 * @param res
 * @param next
 */
const authenticateUser = (req, res, next) => {
  req.user = null;

  console.log('authenticateUser');
  const accessToken = req.headers.authorization;

  console.log(accessToken);

  const options = {
    url: `http://lexio-authentication:3010/api/users/me`,
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
//////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////// CUSTOM ROUTES
// Returns the app version
/**
 * Returns information about the app
 * Can be used to:
 *  - specify a new version available
 *  - put the game in maintenance mode
 */
app.get('/v:version/app/settings', function(req, res) {
  const major = 0;
  const minor = 1;
  const patch = 0;
  const version = major + '.' + minor + '.' + patch;
  const store = {
    apple: 'itms-apps:itunes.apple.com/app/lexio/id1286536739'
  };

  const maintenance = {
    enable: false,
    message: 'Sorry, Lexio is down for maintenance'
  };

  res.send({version, major, minor, patch, store, maintenance});
});

/**
 * Logs in the user
 * Not used by the app
 */
app.post('/v:version/authentication/users/login', (req, res) => {
  let options = {
    url: `http://lexio-authentication:3010/api/users/login`,
    form: req.body
  };

  return request.post(options, (error, response, body) => {
    const statusCode = get(response, 'statusCode') || 500;
    if (error) {
      res.status(statusCode).send(error);
    } else {
      try {
        res.status(statusCode).json(JSON.parse(body));
      }catch (parsingError) {
        res.status(500).send(parsingError.message);
      }
    }
  });
});

/**
 * Logs in the user via Facebook
 * This url is called by Facebook server and send a token
 */
app.post('/v:version/authentication/facebook/token', (req, res) => {

  let options = {
    url: `http://lexio-authentication:3010/facebook/token`,
    form: req.body
  };

  return request.post(options, (error, response, body) => {
    const statusCode = get(response, 'statusCode') || 500;
    if (error) {
      res.status(statusCode).send(error);
    } else {
      try {
        res.status(statusCode).json(JSON.parse(body));
      }catch (parsingError) {
        res.status(500).send(parsingError.message);
      }
    }
  });
});

//////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////// CLASSIC ROUTES
app.get('/v:version/:service/(*)', authenticateUser, (req, res) => {
  if (req.user) {
    const search = getUrlSearch(req.originalUrl);

    let headers = {};

    /* Todo: Separate the authentication/autorization and the user services */
    if (req.params.service === 'user') {
      req.params.service = 'authentication';
      headers = {
        "X-Access-Token": req.headers.authorization
      }
    }else{
      headers = setAuthorization(req.user);
    }
    /**/

    const host = `lexio-${req.params.service}`;
    let options = {
      url: `http://${host}:3010/api/${req.params['0']}${search}`,
      headers
    };

    return request(options, (error, response, body) => {
      const statusCode = get(response, 'statusCode') || 500;
      if (error) {
        res.status(statusCode).send(error);
      } else {
        try {
          res.status(statusCode).json(JSON.parse(body));
        }catch (parsingError) {
          res.status(500).send(parsingError.message);
        }
      }
    });
  }else{
    let error = new Error('Authorization Required');
    error.statusCode = 401;
    res.send(error);
  }
});

app.post('/v:version/:service/(*)', authenticateUser, (req, res) => {
  const search = getUrlSearch(req.originalUrl);

  /* Todo: Separate the authentication/autorization and the user services */
  if (req.params.service === 'user') {
    req.params.service = 'authentication';
  }
  /**/

  const host = `lexio-${req.params.service}`;

  let options = {
    url: `http://${host}:3010/api/${req.params['0']}${search}`,
    headers: {},
    form: req.body
  };

  if (req.user) {
    options.headers = setAuthorization(req.user);
    console.log(options.headers);

    return request.post(options, (error, response, body) => {
      const statusCode = get(response, 'statusCode') || 500;
      if (error) {
        res.status(statusCode).send(error);
      } else {
        try {
          res.status(statusCode).json(JSON.parse(body));
        }catch (parsingError) {
          res.status(500).send(parsingError.message);
        }
      }
    });
  }else{
    let error = new Error('Authorization Required');
    error.statusCode = 401;
    res.send(error);
  }
});

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////  UTILS
function getUrlSearch(url) {
  let search = '';
  const split = url.split('?');
  if (split.length === 2) {
    search = '?' + split[1];
  }
  return search;
}

function setAuthorization(user) {
  let header = {};
  const token = 'Bearer ' + jwt.sign(JSON.parse(JSON.stringify(user)), process.env.JWT_SECRET, {
      expiresIn: 1440 // expires in 24 hours
    });

  header['authorization'] = token;
  return header;
}