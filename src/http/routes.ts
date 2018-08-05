import { NextFunction, Request, Response, Router } from "express";

import * as settingsController from './controllers/settingsController';
import * as authenticateController from './controllers/authenticateController';
import * as serviceController from './controllers/serviceController';
import { authenticate } from "./middlewares/authenticate";

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
routes.get('/v:apiVersion/app/settings', settingsController.read);
routes.get('/app/settings', settingsController.read);

/**
 * Logs in the user
 * Not used by the app
 */
routes.post('/v:apiVersion/authentication/users/login', authenticateController.authenticate);
routes.post('/authentication/users/login', authenticateController.authenticate);

/**
 * Login via Facebook
 */
routes.post('/v:apiVersion/authentication/facebook/token', authenticateController.authenticateViaFacebook);
routes.post('/authentication/facebook/token', authenticateController.authenticateViaFacebook);

routes.get("/v:apiVersion/user/users/me", serviceController.me);
routes.get("/user/users/me", serviceController.me);

/**
 * Classic routes
 */
routes.get("/v:apiVersion/:service/(*)", authenticate, serviceController.read);
routes.get("/:service/(*)", authenticate, serviceController.read);

routes.post("/v:apiVersion/:service/(*)", authenticate, serviceController.create);
routes.post("/:service/(*)", authenticate, serviceController.create);

export default routes;
