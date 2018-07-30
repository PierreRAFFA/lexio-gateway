/**
 * This file may be modified by the scaffold
 * so, do not modify it except if you know what you are doing
 */

import server from './http/server';
import logger from './logger';
const chalk = require('chalk');
const pkg = require('../package.json');

class AppBase {

  ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  constructor() {}
  ////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////  START
  /**
   * Starts the app
   *
   * @returns {Promise<void>}
   */
  public async start(): Promise<void> {
    chalk.enabled = true;
    logger.info(chalk.bgGreen('App version', pkg.version));
    logger.info(chalk.bgGreen('NODE_ENV:', process.env.NODE_ENV));

    await this.startHttp();
  }

  /**
   * Starts the express Server
   *
   * @returns {Promise<void>}
   */
  protected async startHttp(): Promise<void> {

    logger.info(chalk.green('=================================================================================='));
    logger.info(chalk.green('HTTP_PORT (default 3000):           ', process.env.HTTP_PORT));
    logger.info(chalk.green('=================================================================================='));

    server.start({
      port: +process.env.HTTP_PORT || 3000,
    });
  }
}

export default AppBase;
