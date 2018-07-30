import AppBase from './appBase';
import serviceRegistry from "./serviceRegistry";

class App extends AppBase {

  ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  constructor() {
    super();
  }
  ////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////  START
  /**
   * Starts the app
   *
   * @returns {Promise<void>}
   */
  public async start(): Promise<void> {
    super.start();

    this.registerServices();
  }

  /**
   * Registers all services by API version
   */
  public registerServices() {

    serviceRegistry.register('0.1', 'lexio-authentication', 'http://lexio-authentication:3010');
    serviceRegistry.register('0.1', 'lexio-game', 'http://lexio-game:3010');
    serviceRegistry.register('0.1', 'lexio-purchase', 'http://lexio-purchase:3010');
    serviceRegistry.register('0.1', 'lexio-notification', 'http://lexio-notification:3010');
    serviceRegistry.register('0.1', 'lexio-social', 'http://lexio-social:3010');

    serviceRegistry.register('1', 'lexio-authentication', 'http://lexio-authentication:3010');
    serviceRegistry.register('1', 'lexio-game', 'http://lexio-game2:3010');  // <=================== lexio-game v2
    serviceRegistry.register('1', 'lexio-purchase', 'http://lexio-purchase:3010');
    serviceRegistry.register('1', 'lexio-notification', 'http://lexio-notification:3010');
    serviceRegistry.register('1', 'lexio-social', 'http://lexio-social:3010');
  }
}

export default App;
