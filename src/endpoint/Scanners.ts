import { ScannerApp } from '../types/ScannerApp';
import Endpoint from './Endpoint';

/**
 * The scanners endpoint.
 */
const endpoint = '/scanners';

/**
 * Communicate with the scanners endpoints.
 */
export default class ScannersEndpoint extends Endpoint {
  /**
   * Returns the scanner app by registration code.
   *
   * @param registrationCode The registration code of the scanner app.
   * @returns The scanner app.
   */
  public getByRegistrationCode = async (registrationCode: string): Promise<ScannerApp | null> => {
    return await this.doGet<ScannerApp | null>(`${endpoint}/registrationCode/${registrationCode}`);
  };
}
