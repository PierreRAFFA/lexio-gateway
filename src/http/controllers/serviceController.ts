import { Response } from "express";
import { lexio, getServiceHost, LexioError, LexioRequest, IFullUser } from "lexio";
import * as jwt from 'jsonwebtoken';
import * as request from 'request';
import { Response as ResponseRequest } from 'request';
import { get, assign } from 'lodash';
import { getApiVersion } from "../../utils/utils";

/**
 *
 * @param {LexioRequest} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
export const me = async (req: LexioRequest, res: Response) => {
  const accessToken: string = req.headers.authorization as string;
  console.log(accessToken);

  try {
    const user: IFullUser = await lexio.fromReq(req).me();
    res.status(200).send(user);
  }catch (e) {
    res.status(e.statusCode).send(e.message);
  }
}

/**
 *
 * @param {LexioRequest} req
 * @param {e.Response} res
 * @returns {any}
 */
export const read = (req: LexioRequest, res: Response) => {
  console.log('read');
  if (req.user) {

    const { service } = req.params;
    const apiVersion: string = getApiVersion(req);

    //create headers to send to the services
    let headers = setAuthorization(req.user);
    headers = assign({} , headers, {ApiVersion: apiVersion});

    //build url
    const search = getURLParams(req.originalUrl);
    const host = getServiceHost(apiVersion, `lexio-${service}`);
    const options: any = {
      url: `${host}/api/${req.params['0']}${search}`,
      headers
    };

    console.log(options.url);

    //call microservice
    return request(options, (error: any, response: ResponseRequest, body: any) => {
      const statusCode = get(response, 'statusCode') || 500;
      console.log('here');
      console.log(statusCode);
      if (error || response.statusCode >= 400) {
        res.status(statusCode).send(error || body);
      } else {
        try {
          res.status(statusCode).json(JSON.parse(body));
        } catch (parsingError) {
          res.status(500).send(parsingError.message);
        }
      }
    });
  } else {
    const error: LexioError = new Error('Authorization Required') as LexioError;
    error.statusCode = 401;
    res.send(error);
  }
};

export const create = (req: LexioRequest, res: Response) => {
  console.log('create');
  if (req.user) {

    const { service } = req.params;
    const apiVersion: string = getApiVersion(req);

    //create headers to send to the services
    let headers = setAuthorization(req.user);
    headers = assign({} , headers, {ApiVersion: apiVersion});

    //build url
    const search = getURLParams(req.originalUrl);
    const host = getServiceHost(apiVersion, `lexio-${service}`);
    const options: any = {
      url: `${host}/api/${req.params['0']}${search}`,
      headers,
      form: req.body
    };

    console.log(options.url);

    console.log(req);

    //call microservice
    return request.post(options, (error: any, response: ResponseRequest, body: any) => {
      const statusCode = get(response, 'statusCode') || 500;
      if (error || response.statusCode >= 400) {
        res.status(statusCode).send(error || body);
      } else {
        try {
          res.status(statusCode).json(JSON.parse(body));
        } catch (parsingError) {
          res.status(500).send(parsingError.message);
        }
      }
    });
  } else {
    const error: LexioError = new Error('Authorization Required') as LexioError;
    error.statusCode = 401;
    res.send(error);
  }
};

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////  UTILS
function getURLParams(url: string) {
  let search = '';
  const split = url.split('?');
  if (split.length === 2) {
    search = '?' + split[1];
  }
  return search;
}

function setAuthorization(user: any) {
  const header: any = {};
  const token = 'Bearer ' + jwt.sign(JSON.parse(JSON.stringify(user)), process.env.JWT_SECRET, {
    expiresIn: 1440 // expires in 24 hours
  });

  header['authorization'] = token;
  return header;
}
