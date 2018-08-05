import { NextFunction, Response } from "express";
import { lexio, LexioRequest, IFullUser } from "lexio";
import { assign } from 'lodash';

/**
 * Populates the request by setting the user.
 * This user can be retrieved from the next middlewares or the remote methods
 *
 */
export async function authenticate(req: LexioRequest, res: Response, next: NextFunction) {
  console.log('authenticate');

  req.user = undefined;

  console.log('authenticateUser');

  // access_token sent by the client in Authorization
  // Authorization will become the JWT afterwards
  const accessToken: string = req.headers.authorization;
  console.log(accessToken);

  try {
    const user: IFullUser = await lexio.fromReq(req).me();

    console.log('USER IS');
    console.log(user);
    req.user = assign({}, user, {accessToken});
    next();

  }catch (e) {
    console.log('OOOOOOOOO');
    console.log(e);
    next(e);
    // res.status(500).send(e.message);
  }

  //
  //
  // const host: string = getServiceHost(apiVersion, `lexio-authentication`);
  // const options = {
  //   url: `${host}/api/users/me`,
  //   headers: {
  //     "authorization": accessToken
  //   }
  // };
  //
  // request(options, (error: any, response: RequestResponse, body: any) => {
  //   console.log(body);
  //   if (error) {
  //     res.status(500).send(error);
  //   } else {
  //
  //     let json;
  //     try {
  //       json = JSON.parse(body);
  //     } catch (parsingError) {
  //       res.status(500).send(parsingError.message);
  //       return;
  //     }
  //
  //     if (response.statusCode !== 200) {
  //       res.status(response.statusCode).send(json);
  //     } else {
  //       req.user = assign({}, json, {accessToken});
  //       next();
  //     }
  //   }
  // });
}
