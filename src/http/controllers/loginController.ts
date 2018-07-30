import { Request, Response } from "express";
import * as request from 'request';
import { get } from "lodash";
import { Response as ResponseRequest } from "request";
import serviceRegistry from "../../serviceRegistry";
import logger from "../../logger";

/**
 * Logins
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {request.Request}
 */
export let loginWithUsername = (req: Request, res: Response) => {

  const { apiVersion } = req.params;

  let options = {
    url: serviceRegistry.getServiceHost(apiVersion, 'lexio-authentication') + '/api/users/login',
    form: req.body
  };

  console.log(options.url);
  return request.post(options, (error: any, response: ResponseRequest, body: any) => {
    const statusCode = get(response, 'statusCode') || 500;
    if (error) {
      res.status(statusCode).send(error);
      logger.error(error);
    } else {
      try {
        res.status(statusCode).json(JSON.parse(body));
      }catch (parsingError) {
        res.status(500).send(parsingError.message);
        logger.error(parsingError.stack);
      }
    }
  });
}

/**
 * Logins via Facebook
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {request.Request}
 */
export let loginViaFacebook = (req: Request, res: Response) => {

  const { apiVersion } = req.params;

  let options = {
    url: serviceRegistry.getServiceHost(apiVersion, 'lexio-authentication') + '/facebook/token',
    form: req.body
  };

  return request.post(options, (error: any, response: ResponseRequest, body: any) => {
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
}
