import { ApiKey } from './ApiKey';
import Endpoint from './Endpoint';
import { Organization } from './Organization';
import { ScannerInvite } from './ScannerInvite';

/**
 * Communicate with the organizations endpoints.
 */
export default class OrganizationsEndpoint extends Endpoint {
  /**
   * The endpoint.
   */
  public static readonly endpoint = '/organization';

  /**
   * Returns the authenticated organization.
   *
   * @returns The organization.
   */
  public getMine = async (): Promise<Organization> => {
    const url = OrganizationsEndpoint.endpoint;

    return await this.req.fetch<Organization>(url, {
      method: 'GET',
    });
  };

  /**
   * Returns a scanner invite by code.
   *
   * @param code The invite code.
   */
  public getScannerInvite = async (code: string): Promise<ScannerInvite | null> => {
    const url = `${OrganizationsEndpoint.endpoint}/scanners/invites/${code}`;

    return await this.req.fetch<ScannerInvite>(
      url,
      {
        method: 'GET',
      },
      false,
    );
  };

  /**
   * Begins the scanner exchange.
   *
   * @param code The invite code.
   */
  public startScannerExchange = async (code: string): Promise<ScannerInvite | null> => {
    const url = `${OrganizationsEndpoint.endpoint}/scanners/invites/${code}/start`;

    return await this.req.fetch<ScannerInvite>(
      url,
      {
        method: 'GET',
      },
      false,
    );
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
    const url = `${OrganizationsEndpoint.endpoint}/scanners/invites`;

    return await this.req.fetch<ApiKey>(
      url,
      {
        method: 'POST',
        body: JSON.stringify({
          code,
          pushToken,
          scannerDeviceInfo,
        }),
      },
      false,
    );
  };

  /**
   * Returns the API keys for the authenticated organization.
   */
  public getApiKeys = async (): Promise<ApiKey[]> => {
    const url = `${OrganizationsEndpoint.endpoint}/apiKeys`;

    return await this.req.fetch<ApiKey[]>(url, {
      method: 'GET',
    });
  };

  /**
   * Returns an API key by ID.
   *
   * @param id The ID of the API key.
   */
  public getApiKey = async (id: string, scanner: any = ''): Promise<ApiKey | null> => {
    const scannerStr = encodeURIComponent(JSON.stringify(scanner));
    const url = `${OrganizationsEndpoint.endpoint}/apiKeys/${id}?scanner=${scannerStr}`;

    return await this.req.fetch<ApiKey | null>(url, {
      method: 'GET',
    });
  };

  /**
   * Deletes an API key.
   *
   * @param id The ID of the API key.
   */
  public deleteApiKey = async (id: string): Promise<void> => {
    const url = `${OrganizationsEndpoint.endpoint}/apiKeys/${id}`;

    return await this.req.fetch<void>(url, {
      method: 'DELETE',
    });
  };
}
