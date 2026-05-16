import { Requester } from '../http/Requester';
import { ApiKey } from '../types/ApiKey';
import { Organization } from '../types/Organization';
import { ScannerDeviceInfo } from '../types/ScannerDeviceInfo';
import { ScannerInvite } from '../types/ScannerInvite';
import Endpoint from './Endpoint';

/**
 * Communicate with the organizations endpoints.
 */
export default class OrganizationsEndpoint extends Endpoint {
  /**
   * Constructor.
   *
   * @param req The object to use to make requests.
   */
  constructor(req: Requester) {
    super(req, '/organization');
  }

  /**
   * Fetches the details of the authenticated organization.
   *
   * @returns The organization.
   */
  public getMine = async (): Promise<Organization> => {
    return await this.do.get<Organization>('');
  };

  /**
   * Returns a scanner invite by code.
   *
   * @param code The invite code.
   */
  public getScannerInvite = async (code: string): Promise<ScannerInvite | null> => {
    return await this.do.get<ScannerInvite>(`/scanners/invites/${code}`, false);
  };

  /**
   * Begins the scanner exchange.
   *
   * @param code The invite code.
   */
  public startScannerExchange = async (code: string): Promise<ScannerInvite | null> => {
    return await this.do.get<ScannerInvite>(`/scanners/invites/${code}/start`, false);
  };

  /**
   * Accepts an scanner app invite code and returns api keys.
   *
   * @param code The invite code.
   * @param pushToken The push token.
   * @param scannerDeviceInfo The scanner device info.
   */
  public finishScannerExchange = async (
    code: string,
    pushToken: string,
    scannerDeviceInfo: ScannerDeviceInfo,
  ): Promise<ApiKey> => {
    return await this.do.post<ApiKey>(
      '/scanners/invites',
      {
        code,
        pushToken,
        scannerDeviceInfo,
      },
      false,
    );
  };

  /**
   * Returns the API keys for the authenticated organization.
   */
  public getApiKeys = async (): Promise<ApiKey[]> => {
    return await this.do.get<ApiKey[]>('/apiKeys');
  };

  /**
   * Returns an API key by ID.
   *
   * @param id The ID of the API key.
   */
  public getApiKey = async (id: string, scanner: any = ''): Promise<ApiKey | null> => {
    const url = this.qb.create('/apiKeys/{id}')
      .addParam('id', id)
      .addQuery('scanner', JSON.stringify(scanner));

    return await this.do.get<ApiKey | null>(url);
  };

  /**
   * Deletes an API key.
   *
   * @param id The ID of the API key.
   */
  public deleteApiKey = async (id: string): Promise<void> => {
    return await this.do.del<void>(`/apiKeys/${id}`);
  };
}
