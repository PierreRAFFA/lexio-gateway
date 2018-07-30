import { NextFunction, Request, Response, Router } from "express";

import * as settingsController from './controllers/settingsController';
import * as loginController from './controllers/loginController';
import * as exampleController from './controllers/example';

const routes: Router = require('express').Router();

routes.get('/', (req: Request, res: Response) => {
    res.status(200).send('Server running successfully');
});
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////// HEALTHCHECK
routes.get('/healthcheck', (req: Request, res: Response) => {
  res.status(200).send('');
});

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////// SETTINGS
/**
 * Get Settings
 */
routes.get('/v:apiVersion/app/settings', settingsController.get);

/**
 * Logs in the user
 * Not used by the app
 */
routes.post('/v:apiVersion/authentication/users/login', loginController.loginWithUsername);

/**
 * Login via Facebook
 */
routes.post('/v:apiVersion/authentication/facebook/token', loginController.loginViaFacebook);

routes.get("/examples/:id", exampleController.get);
routes.post("/example", exampleController.post);
routes.put("/examples/:id", exampleController.put);
routes.delete("/examples/:id", exampleController.del);
routes.patch("/examples/:id", exampleController.patch);

export default routes;
