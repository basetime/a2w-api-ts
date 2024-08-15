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

    return await this.req.fetch<ScannerInvite>(url, {
      method: 'GET',
    });
  };

  /**
   * Accepts an scanner app invite code and returns api keys.
   *
   * @param code The invite code.
   */
  public exchangeScannerInvite = async (code: string): Promise<{ key: string; secret: string }> => {
    const url = `${OrganizationsEndpoint.endpoint}/scanners/invites`;

    return await this.req.fetch<{ key: string; secret: string }>(
      url,
      {
        method: 'POST',
        body: JSON.stringify({
          code,
        }),
      },
      false,
    );
  };
}
