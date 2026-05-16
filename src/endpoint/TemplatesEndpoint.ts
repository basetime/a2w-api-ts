import { Requester } from '../http/Requester';
import { Template } from '../types/Template';
import { TemplateThumbnail } from '../types/TemplateThumbnail';
import Endpoint from './Endpoint';

/**
 * Communicate with the templates endpoints.
 */
export default class TemplatesEndpoint extends Endpoint {
  /**
   * Constructor.
   *
   * @param req The object to use to make requests.
   */
  constructor(req: Requester) {
    super(req, '/templates');
  }

  /**
   * Returns a template by ID.
   *
   * @param id The ID of the template.
   */
  public getById = async (id: string): Promise<TemplateThumbnail> => {
    return await this.do.get(`/simple/${id}`);
  };

  /**
   * Returns all of the templates for authenticated organization.
   *
   * @returns The templates.
   */
  public getAll = async (): Promise<Template[]> => {
    return await this.do.get('/organization');
  };

  /**
   * Returns all of the templates for a specific tag.
   *
   * @param tag The tag.
   * @returns The templates.
   */
  public getByTag = async (tag: string): Promise<TemplateThumbnail[]> => {
    return await this.do.get(`/tagged/${tag}`);
  };
}
