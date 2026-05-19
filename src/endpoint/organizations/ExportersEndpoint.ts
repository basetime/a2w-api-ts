import { z } from 'zod';
import { Exporter, ExporterInput, ExporterSchema } from '../../types/Exporter';
import { ExporterLog, ExporterLogSchema } from '../../types/ExporterLog';
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
   * @param parent The parent `OrganizationsEndpoint` whose `req`, `do`, and `qb` are
   *   reused.
   */
  constructor(parent: Endpoint) {
    super(parent);
  }

  /**
   * Returns all exporters for the authenticated organization.
   */
  public getAll = async (): Promise<Exporter[]> => {
    return await this.do.get('/exporters', z.array(ExporterSchema));
  };

  /**
   * Returns a single exporter by ID.
   *
   * @param id The ID of the exporter.
   */
  public getById = async (id: string): Promise<Exporter> => {
    return await this.do.get(`/exporters/${id}`, ExporterSchema);
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
    return await this.do.put('/exporters', body, z.array(ExporterSchema));
  };

  /**
   * Updates an existing exporter.
   *
   * @param id The ID of the exporter.
   * @param body The new exporter values.
   */
  public update = async (id: string, body: ExporterInput): Promise<Exporter> => {
    return await this.do.post(`/exporters/${id}`, body, ExporterSchema);
  };

  /**
   * Deletes an exporter.
   *
   * @param id The ID of the exporter to delete.
   */
  public delete = async (id: string): Promise<string> => {
    return await this.do.del(`/exporters/${id}`, z.string());
  };

  /**
   * Runs an exporter on demand.
   *
   * @param id The ID of the exporter to run.
   */
  public run = async (id: string): Promise<string> => {
    return await this.do.post(`/exporters/${id}/run`, {}, z.string());
  };

  /**
   * Returns the execution logs for an exporter.
   *
   * @param id The ID of the exporter.
   */
  public getLogs = async (id: string): Promise<ExporterLog[]> => {
    return await this.do.get(`/exporters/${id}/logs`, z.array(ExporterLogSchema));
  };

  /**
   * Returns a single execution log entry for an exporter.
   *
   * @param id The ID of the exporter.
   * @param logId The ID of the log entry.
   */
  public getLog = async (id: string, logId: string): Promise<ExporterLog> => {
    return await this.do.get(`/exporters/${id}/logs/${logId}`, ExporterLogSchema);
  };
}
