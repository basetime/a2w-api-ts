import { ApiKey } from '../types/ApiKey';
import { Organization } from '../types/Organization';
import { ScannerInvite } from '../types/ScannerInvite';
import Endpoint from './Endpoint';

/**
 * The organizations endpoint.
 */
const endpoint = '/organization';

/**
 * Communicate with the organizations endpoints.
 */
export default class OrganizationsEndpoint extends Endpoint {
  /**
   * Returns the authenticated organization.
   *
   * @returns The organization.
   */
  public getMine = async (): Promise<Organization> => {
    return await this.doGet<Organization>(endpoint);
  };

  /**
   * Returns a scanner invite by code.
   *
   * @param code The invite code.
   */
  public getScannerInvite = async (code: string): Promise<ScannerInvite | null> => {
    return await this.doGet<ScannerInvite>(`${endpoint}/scanners/invites/${code}`, false);
  };

  /**
   * Begins the scanner exchange.
   *
   * @param code The invite code.
   */
  public startScannerExchange = async (code: string): Promise<ScannerInvite | null> => {
    return await this.doGet<ScannerInvite>(`${endpoint}/scanners/invites/${code}/start`, false);
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
    scannerDeviceInfo: any,
  ): Promise<ApiKey> => {
    return await this.doPost<ApiKey>(
      `${endpoint}/scanners/invites`,
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
    return await this.doGet<ApiKey[]>(`${endpoint}/apiKeys`);
  };

  /**
   * Returns an API key by ID.
   *
   * @param id The ID of the API key.
   */
  public getApiKey = async (id: string, scanner: any = ''): Promise<ApiKey | null> => {
    const scannerStr = encodeURIComponent(JSON.stringify(scanner));
    const url = `${endpoint}/apiKeys/${id}?scanner=${scannerStr}`;

    return await this.doGet<ApiKey | null>(url);
  };

  /**
   * Deletes an API key.
   *
   * @param id The ID of the API key.
   */
  public deleteApiKey = async (id: string): Promise<void> => {
    return await this.doDelete<void>(`${endpoint}/apiKeys/${id}`);
  };
}
