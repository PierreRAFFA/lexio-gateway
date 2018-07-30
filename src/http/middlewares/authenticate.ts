import { NextFunction, Response } from "express";
import { LexioRequest } from "../../interfaces";
import * as request from 'request';
import { Response as RequestResponse } from "request";
import { assign } from 'lodash';

/**
 * Populates the request by setting the user.
 * This user can be retrieved from the next middlewares or the remote methods
 *
 */
export function authenticate(req: LexioRequest, res: Response, next: NextFunction) {
  console.log('authenticate');

  req.user = undefined;

  console.log('authenticateUser');
  const accessToken = req.headers.authorization;

  console.log(accessToken);

  const options = {
    url: `http://lexio-authentication:3010/api/users/me`,
    headers: {
      "authorization": accessToken
    }
  };

  request(options, (error: any, response: RequestResponse, body: any) => {
    console.log(body);
    if (error) {
      res.status(500).send(error);
    } else {

      let json;
      try {
        json = JSON.parse(body);
      } catch (parsingError) {
        res.status(500).send(parsingError.message);
        return;
      }

      if (response.statusCode !== 200) {
        res.status(response.statusCode).send(json);
      } else {
        req.user = assign({}, json, {accessToken});
        next();
      }
    }
  });
}
