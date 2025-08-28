import { ApiKey } from '../types/ApiKey';
import { ScannerApp } from '../types/ScannerApp';
import { ScannerDeviceInfo } from '../types/ScannerDeviceInfo';
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
    return await this.doGet<ScannerApp | null>(
      `${endpoint}/registrationCode/${registrationCode}`,
      false,
    );
  };

  /**
   * Exchanges a scanner app for an API key.
   *
   * @param scannerApp The scanner app to register.
   * @param deviceInfo The device info.
   */
  public registerScanner = async (
    scannerApp: ScannerApp,
    deviceInfo: ScannerDeviceInfo,
  ): Promise<ApiKey | null> => {
    return await this.doPost<ApiKey | null>(
      `${endpoint}/register/${scannerApp.id}`,
      deviceInfo,
      false,
    );
  };
}
