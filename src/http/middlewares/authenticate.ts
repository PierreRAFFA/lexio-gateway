import { NextFunction, Response } from "express";
import { lexio, LexioRequest, IFullUser } from 'lexio';
import { assign } from 'lodash';

/**
 * Populates the request by setting the user.
 * This user can be retrieved from the next middlewares or the remote methods
 *
 */
export async function authenticate(req: LexioRequest, res: Response, next: NextFunction) {
  console.log('authenticate');

  req.user = undefined;

  // access_token sent by the client in Authorization
  // Authorization will become the JWT afterwards
  const accessToken: string = req.headers.authorization as string;
  console.log(accessToken);

  try {
    const user: IFullUser = await lexio.fromReq(req).me();

    console.log('USER IS');
    console.log(user);
    req.user = assign({}, user, {accessToken});
    next();

  }catch (e) {
    // console.log(e);
    // next(e);
    res.status(e.statusCode || 500).json(e);
  }
}
