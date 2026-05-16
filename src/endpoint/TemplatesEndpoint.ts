import { Requester } from '../http/Requester';
import { Template } from '../types/Template';
import { TemplateThumbnail } from '../types/TemplateThumbnail';
import Endpoint from './Endpoint';

/**
 * Argument shape for {@link TemplatesEndpoint.import}.
 *
 * Either a runtime `Blob`/`File` is passed through directly, or `{ name, content }` is
 * used to construct one with the supplied filename and JSON content.
 */
export type TemplateImportFile =
  | Blob
  | File
  | {
      /**
       * Optional filename used in the multipart form. Defaults to `template.json`.
       */
      name?: string;
      /**
       * The JSON content to upload, as a string.
       */
      content: string;
    };

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

  /**
   * Deletes a template.
   *
   * @param id The ID of the template to delete.
   */
  public delete = async (id: string): Promise<string> => {
    return await this.do.del(`/${id}`);
  };

  /**
   * Clones a template and returns the new template.
   *
   * @param id The ID of the template to clone.
   */
  public clone = async (id: string): Promise<Template> => {
    return await this.do.post(`/${id}/clone`, {});
  };

  /**
   * Exports a template as a JSON bundle suitable for re-importing into another
   * organization.
   *
   * Returns the parsed JSON object as returned by the backend.
   *
   * @param id The ID of the template to export.
   */
  public export = async (id: string): Promise<Record<string, unknown>> => {
    return await this.do.get(`/${id}/export`);
  };

  /**
   * Imports a template from a JSON bundle previously produced by {@link export}.
   *
   * Sends a `multipart/form-data` POST. The `Content-Type` header is left unset so the
   * runtime can attach the correct multipart boundary automatically.
   *
   * @param file The file to upload. Pass a `Blob`/`File`, or `{ name, content }` to build
   *   one from a string.
   */
  public import = async (file: TemplateImportFile): Promise<Template> => {
    const form = new FormData();
    if (file instanceof Blob) {
      const filename = file instanceof File ? file.name : 'template.json';
      form.append('file', file, filename);
    } else {
      const filename = file.name || 'template.json';
      form.append(
        'file',
        new Blob([file.content], { type: 'application/json' }),
        filename,
      );
    }

    return await this.do.fetch('/import', {
      method: 'POST',
      body: form,
    });
  };
}
