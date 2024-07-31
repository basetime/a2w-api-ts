import { Template } from 'passkit-generator/lib/schemas';
import Endpoint from './Endpoint';

/**
 * Communicate with the templates endpoints.
 */
export default class TemplatesEndpoint extends Endpoint {
  /**
   * The endpoint.
   */
  public static readonly endpoint = '/templates';

  /**
   * Returns all of the templates for authenticated organization.
   *
   * @returns The templates.
   */
  public getAll = async (): Promise<Template[]> => {
    const url = `${TemplatesEndpoint.endpoint}/organization`;

    return await this.req.fetch<Template[]>(url, {
      method: 'GET',
    });
  };
}
