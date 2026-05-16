import { Requester } from '../http/Requester';
import { ApiKey } from '../types/ApiKey';
import { ScannerApp, ScannerAppInput } from '../types/ScannerApp';
import { ScannerDeviceInfo } from '../types/ScannerDeviceInfo';
import Endpoint from './Endpoint';

/**
 * Communicate with the scanners endpoints.
 */
export default class ScannersEndpoint extends Endpoint {
  /**
   * Constructor.
   *
   * @param req The object to use to make requests.
   */
  constructor(req: Requester) {
    super(req, '/scanners');
  }

  /**
   * Returns the scanner app by registration code.
   *
   * @param registrationCode The registration code of the scanner app.
   * @returns The scanner app.
   */
  public getByRegistrationCode = async (registrationCode: string): Promise<ScannerApp | null> => {
    return await this.do.get(`/registrationCode/${registrationCode}`, false);
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
    return await this.do.post(
      `/register/${scannerApp.id}`,
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
    return await this.do.del(`/deregister/${apiKey.id}`);
  };

  /**
   * Returns all the scanner apps for the authenticated organization.
   */
  public getAll = async (): Promise<ScannerApp[]> => {
    return await this.do.get('/organizations/apps');
  };

  /**
   * Returns the scanner app with the given ID.
   *
   * @param id The ID of the scanner app.
   */
  public getById = async (id: string): Promise<ScannerApp | null> => {
    return await this.do.get(`/organizations/${id}`);
  };

  /**
   * Creates a new scanner app.
   *
   * @param app The scanner app to create.
   */
  public createApp = async (app: ScannerAppInput): Promise<ScannerApp | null> => {
    return await this.do.post('/organizations/apps', app);
  };

  /**
   * Updates a scanner app.
   *
   * @param id The ID of the scanner app.
   * @param app The scanner app to update.
   */
  public updateApp = async (id: string, app: ScannerAppInput): Promise<ScannerApp | null> => {
    return await this.do.post(`/organizations/${id}`, app);
  };

  /**
   * Deletes a scanner app.
   *
   * @param id The ID of the scanner app.
   */
  public deleteApp = async (id: string): Promise<void> => {
    return await this.do.del(`/organizations/apps/${id}`);
  };
}
