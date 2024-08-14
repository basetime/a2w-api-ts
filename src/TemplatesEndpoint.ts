import { Template } from 'passkit-generator/lib/schemas';
import Endpoint from './Endpoint';
import { TemplateThumbnail } from './TemplateThumbnail';

/**
 * Communicate with the templates endpoints.
 */
export default class TemplatesEndpoint extends Endpoint {
  /**
   * The endpoint.
   */
  public static readonly endpoint = '/templates';

  /**
   * Returns a template by ID.
   *
   * @param id The ID of the template.
   */
  public getById = async (id: string): Promise<TemplateThumbnail> => {
    const url = `${TemplatesEndpoint.endpoint}/simple/${id}`;

    return await this.req.fetch<TemplateThumbnail>(url, {
      method: 'GET',
    });
  };

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

  /**
   * Returns all of the templates for a specific tag.
   *
   * @param tag The tag.
   * @returns The templates.
   */
  public getByTag = async (tag: string): Promise<TemplateThumbnail[]> => {
    const url = `${TemplatesEndpoint.endpoint}/tagged/${tag}`;

    return await this.req.fetch<TemplateThumbnail[]>(url, {
      method: 'GET',
    });
  };
}
