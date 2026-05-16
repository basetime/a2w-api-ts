import { Requester } from '../../http/Requester';
import { Exporter, ExporterInput } from '../../types/Exporter';
import { ExporterLog } from '../../types/ExporterLog';
import Endpoint from '../Endpoint';

/**
 * Communicate with the `/organization/exporters*` sub-endpoints.
 *
 * Accessed via `client.organizations.exporters`. CRUD on exporters plus the ability to
 * run an exporter on demand and tail its execution logs.
 */
export default class OrganizationExportersEndpoint extends Endpoint {
  /**
   * Constructor.
   *
   * @param req The object to use to make requests.
   */
  constructor(req: Requester) {
    super(req, '/organization');
  }

  /**
   * Returns all exporters for the authenticated organization.
   */
  public getAll = async (): Promise<Exporter[]> => {
    return await this.do.get('/exporters');
  };

  /**
   * Returns a single exporter by ID.
   *
   * @param id The ID of the exporter.
   */
  public getById = async (id: string): Promise<Exporter> => {
    return await this.do.get(`/exporters/${id}`);
  };

  /**
   * Creates a new exporter.
   *
   * The backend uses `PUT` for create on this collection (the corresponding `POST` is the
   * update verb), matching the route definitions. Returns the full list of exporters after
   * creation, mirroring the backend response.
   *
   * @param body The exporter to create.
   */
  public create = async (body: ExporterInput): Promise<Exporter[]> => {
    return await this.do.put('/exporters', body);
  };

  /**
   * Updates an existing exporter.
   *
   * @param id The ID of the exporter.
   * @param body The new exporter values.
   */
  public update = async (id: string, body: ExporterInput): Promise<Exporter> => {
    return await this.do.post(`/exporters/${id}`, body);
  };

  /**
   * Deletes an exporter.
   *
   * @param id The ID of the exporter to delete.
   */
  public delete = async (id: string): Promise<string> => {
    return await this.do.del(`/exporters/${id}`);
  };

  /**
   * Runs an exporter on demand.
   *
   * @param id The ID of the exporter to run.
   */
  public run = async (id: string): Promise<string> => {
    return await this.do.post(`/exporters/${id}/run`, {});
  };

  /**
   * Returns the execution logs for an exporter.
   *
   * @param id The ID of the exporter.
   */
  public getLogs = async (id: string): Promise<ExporterLog[]> => {
    return await this.do.get(`/exporters/${id}/logs`);
  };

  /**
   * Returns a single execution log entry for an exporter.
   *
   * @param id The ID of the exporter.
   * @param logId The ID of the log entry.
   */
  public getLog = async (id: string, logId: string): Promise<ExporterLog> => {
    return await this.do.get(`/exporters/${id}/logs/${logId}`);
  };
}
