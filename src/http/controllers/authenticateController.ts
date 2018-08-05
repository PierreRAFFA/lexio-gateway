import { Request, Response } from "express";
import * as request from 'request';
import logger from "../../logger";
import { lexio, LexioRequest, IAuthenticate, IFullUser } from 'lexio';

/**
 * Logins
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {request.Request}
 */
export const authenticate = async (req: LexioRequest, res: Response) => {
  const { email, password } = req.body;

  try {
    const response: IAuthenticate = await lexio.fromReq(req).authenticate(email, password);
    res.status(200).json(response);
  }catch (e) {
    const statusCode: number = e.statusCode || 500;
    res.status(statusCode).send(e);
    logger.error(e);
  }
};

/**
 * Logins via Facebook
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {request.Request}
 */
export let authenticateViaFacebook = async (req: LexioRequest, res: Response) => {
  const { access_token: accessToken, firebase_token: firebaseToken } = req.body;

  try {
    const response: IFullUser = await lexio.fromReq(req).authenticateViaFacebook(accessToken, firebaseToken);
    res.status(200).json(response);
  }catch (e) {
    const statusCode: number = e.statusCode || 500;
    res.status(statusCode).send(e);
    logger.error(e);
  }
};
