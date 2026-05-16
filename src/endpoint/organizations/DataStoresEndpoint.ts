import { Requester } from '../../http/Requester';
import { DataStore, DataStoreInput } from '../../types/DataStore';
import Endpoint from '../Endpoint';

/**
 * Communicate with the `/organization/dataStores*` sub-endpoints.
 *
 * Accessed via `client.organizations.dataStores`. Provides CRUD over data stores that
 * workflows can read from.
 */
export default class OrganizationDataStoresEndpoint extends Endpoint {
  /**
   * Constructor.
   *
   * @param req The object to use to make requests.
   */
  constructor(req: Requester) {
    super(req, '/organization');
  }

  /**
   * Returns all data stores for the authenticated organization.
   */
  public getAll = async (): Promise<DataStore[]> => {
    return await this.do.get('/dataStores');
  };

  /**
   * Returns a single data store by ID.
   *
   * @param id The ID of the data store.
   */
  public getById = async (id: string): Promise<DataStore> => {
    return await this.do.get(`/dataStores/${id}`);
  };

  /**
   * Creates a new data store.
   *
   * The backend uses `PUT` for create on this collection (the corresponding `POST` is the
   * update verb), matching the route definitions.
   *
   * @param body The data store to create.
   */
  public create = async (body: DataStoreInput): Promise<DataStore> => {
    return await this.do.put('/dataStores', body);
  };

  /**
   * Updates an existing data store.
   *
   * @param id The ID of the data store.
   * @param body The new data store values.
   */
  public update = async (id: string, body: DataStoreInput): Promise<DataStore> => {
    return await this.do.post(`/dataStores/${id}`, body);
  };

  /**
   * Deletes a data store.
   *
   * Returns the remaining data stores for the organization.
   *
   * @param id The ID of the data store to delete.
   */
  public delete = async (id: string): Promise<DataStore[]> => {
    return await this.do.del(`/dataStores/${id}`);
  };
}
