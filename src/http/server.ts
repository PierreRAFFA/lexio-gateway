import expressApp from './expressApp';
import { Express } from "express";
import logger from "../logger";
import * as https from 'https';
import * as fs from 'fs';
import { ServerOptions } from "https";

const chalk = require('chalk');

export interface IHttpConfig {
  port: number;
}

class Server {

  ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  constructor() {

  }

  ////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////  INIT
  public async start(config: IHttpConfig): Promise<Express> {
    chalk.enabled = true;

    return new Promise<Express>((resolve: Function, reject: Function) => {

      if (process.env.NODE_ENV === 'production') {
        const serverOptions: ServerOptions = {
          key: fs.readFileSync('./ssl/privkey.pem'),
          cert: fs.readFileSync('./ssl/cert.pem'),
          ca: fs.readFileSync('./ssl/chain.pem')

          // This is where the magic happens in Node.  All previous
          // steps simply setup SSL (except the CA).  By requesting
          // the client provide a certificate, we are essentially
          // authenticating the user.
          // requestCert: true,

          // If specified as "true", no unauthenticated traffic
          // will make it to the route specified.
          // rejectUnauthorized: true
        };

        https.createServer(serverOptions, expressApp).listen(3000, function () {
          logger.info(chalk.bgGreen('HTTP: Running at http://localhost:%d'), config.port);
          resolve(expressApp);
        });
      } else {
        expressApp.listen(config.port, () => {
          logger.info(chalk.bgGreen('HTTP: Running at http://localhost:%d'), config.port);
          resolve(expressApp);
        });
      }
    });
  }
}

export default new Server();
