// First import the log
import logger from './logger';

// Then parse .env
require('dotenv').config();

// Then Init the app
import App from './app';

const app: App = new App();
app.start();
