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
   * Registers a new scanner device.
   *
   * @param scannerApp The scanner app being registered.
   * @param pushToken The push token to send notifications to the device.
   * @param deviceInfo The device info.
   */
  public registerDevice = async (
    scannerApp: ScannerApp,
    pushToken: string,
    deviceInfo: ScannerDeviceInfo,
  ): Promise<ApiKey | null> => {
    return await this.doPost<ApiKey | null>(
      `${endpoint}/register/${scannerApp.id}`,
      { deviceInfo, pushToken },
      false,
    );
  };

  /**
   * Deregisters a scanner device.
   *
   * @param apiKey The API received when registering the device.
   */
  public deregisterDevice = async (apiKey: ApiKey): Promise<void> => {
    return await this.doDelete<void>(`${endpoint}/deregister/${apiKey.id}`);
  };
}
