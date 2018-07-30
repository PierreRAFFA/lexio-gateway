import { ApiVersions } from "./interfaces";
import { get } from 'lodash';

class ServiceRegistry {

  protected _versions: ApiVersions;

  constructor() {
    this._versions = {};
  }

  /**
   * Registers a service
   *
   * @param {string} apiVersion
   * @param {string} serviceName
   * @param {string} serviceHost
   */
  public register(apiVersion: string, serviceName: string, serviceHost: string ) {
    if (apiVersion in this._versions == false) {
      this._versions[apiVersion] = {};
    }
    this._versions[apiVersion][serviceName] = serviceHost;
  }

  /**
   * Returns the host for a specific service
   *
   * @param {string} apiVersion
   * @param {string} serviceName
   * @returns {any}
   */
  public getServiceHost(apiVersion: string, serviceName: string) {
    return get(this._versions, `[${apiVersion}][${serviceName}]`);
  }
}

export default new ServiceRegistry();


