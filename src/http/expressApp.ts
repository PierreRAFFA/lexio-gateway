import * as express from 'express';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as path from 'path';
import * as expressValidator from 'express-validator';

import * as errorHandler from 'errorhandler';
import routes from'./routes';
import { Request, Response } from "express";
import * as qs from 'qs';
import logger from "../logger";

// Load environment variables from .env file, where API keys and passwords are configured
// dotenv.config({ path: '.env.example' });

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////// CONFIGURATION
const app: express.Express = express();

// Allows to extend the number of elements in an array specified in a GET parameter.
// (Limited to 20 in the default Express parser)
/////////////////////////////////////////////////
app.set('query parser', function (str: string) {
  return qs.parse(str, {arrayLimit: 1000});
});

// Middleware to compress the responses
///////////////////////////////////////
app.use(compression());

// Middleware for the logs (Standard Apache combined log output)
///////////////////////////////////////////////////////////////
const logFormat: string = ':method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

if (process.env.LOG_LEVEL <= 2) {
  app.use(morgan(logFormat, {
    skip: (req: Request, res: Response) => res.statusCode < 400,
    stream: {
      write: logger.info
    }
  }));
} else {
  app.use(morgan(logFormat, { stream: {
      write: logger.info
    }
  }));
}

// Middleware to parse the incoming request before the handlers
///////////////////////////////////////////////////////////////
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to check the inputs
/////////////////////////////////
app.use(expressValidator());

// Helmet.js helps secure Express servers through setting HTTP headers.
// It adds HSTS, removes the X-Powered-By header and sets the X-Frame-Options header
// to prevent click jacking, among other things. Setting it up is simple.
app.use(require('helmet')());

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

app.use(errorHandler());

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////// ROUTES
app.use('/', routes);

export default app;
