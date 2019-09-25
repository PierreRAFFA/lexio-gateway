# Lexio-gateway

API Gateway

## Technical Overview
- NodeJS  
- Typescript  
- Express
  
## Environment variables

- **NODE_ENV** (ex: production)
- **LOG_LEVEL** (0 to 5)
- **NUM_BACKOFFS**
- **HTTP_PORT** (ex: 3000)
- **AUTH_KEY** 

## Setup the microservice

```bash
$ npm i
$ npm run build
```

## Start the app
```bash
$ npm start
```


## Start the app with pm2

```bash
$ npm run pm2 ms-explore
$ npm run pm2 phoenix-ms-explore
$ npm run pm2 preprod-ms-explore
```

## Healthcheck

The healthcheck is available on GET /healthcheck  
The response will be:

#### Response
```js
{
  "status": "string",
  "version": "string",
  "memory": "string",
  "details": {
    "service1": {
      "status": "string",
      "message": "string",
    }
  }
}
```

#### Status and Response Status

**Status Pass**:  
Specifies that every services passed.  
The status code is **200**  

**Status Warn**:  
Specifies that one or more services are trying to be reconnected.  
The status code is **200**

**Status Fail**:  
Specifies that one or more services have reached the max number of attempts for the reconnection.  
The status code is **500**

### Commands

| Npm Script | Description |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| `start`                   | Starts the app. if NODE_ENV is not production, nodemon will watch the files                       |
| `test`                    | Runs tests using Jest test runner                                                                 |
| `watch`                   | Runs all watch tasks (TypeScript, Node).                                                          |
| `debug`                   | Watchs (Chrome debugger can be used)                                                              |
|  |  |
|  |  |
| `serve`                   | Runs node on `dist/server.js` which is the apps entry point                                       |
| `build`                   | Full build. Runs ALL build tasks (`build-sass`, `build-ts`, `tslint`, `copy-static-assets`)       |
| `build-ts`                | Compiles all source `.ts` files to `.js` files in the `dist` folder                               |
| `watch-ts`                | Same as `build-ts` but continuously watches `.ts` files and re-compiles when needed               |
| `tslint`                  | Runs TSLint on project files                                                                      |


