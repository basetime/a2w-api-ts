import Endpoint from './Endpoint';
import { Organization } from './Organization';

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
}
