import { IAppConfig, IHttpConfig } from "service-foundation/dist/interfaces";
import { App } from "service-foundation";
import { Server } from "service-foundation/dist/modules/http/server";

const pkg = require('../package');

/////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////  APP
const appConfig: IAppConfig = {
    version: pkg.version,
    logLevel: parseInt(process.env.LOG_LEVEL),
};
const app: App = new App().config(appConfig);

/////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////  HTTP
const httpConfig: IHttpConfig = {
    port: Number(process.env.HTTP_PORT),
};
const server: Server = app.http;
server
    .config(httpConfig)
    .start();

export { app };
