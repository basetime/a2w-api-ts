import { Template } from 'passkit-generator/lib/schemas';
import { TemplateThumbnail } from '../types/TemplateThumbnail';
import Endpoint from './Endpoint';

/**
 * The templates endpoint.
 */
const endpoint = '/templates';

/**
 * Communicate with the templates endpoints.
 */
export default class TemplatesEndpoint extends Endpoint {
  /**
   * Returns a template by ID.
   *
   * @param id The ID of the template.
   */
  public getById = async (id: string): Promise<TemplateThumbnail> => {
    const url = `${endpoint}/simple/${id}`;
    return await this.doGet<TemplateThumbnail>(url);
  };

  /**
   * Returns all of the templates for authenticated organization.
   *
   * @returns The templates.
   */
  public getAll = async (): Promise<Template[]> => {
    return await this.doGet<Template[]>(`${endpoint}/organization`);
  };

  /**
   * Returns all of the templates for a specific tag.
   *
   * @param tag The tag.
   * @returns The templates.
   */
  public getByTag = async (tag: string): Promise<TemplateThumbnail[]> => {
    return await this.doGet<TemplateThumbnail[]>(`${endpoint}/tagged/${tag}`);
  };
}
