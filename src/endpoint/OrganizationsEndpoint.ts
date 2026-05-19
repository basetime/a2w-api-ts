import { z } from 'zod';
import { Requester } from '../http/Requester';
import { ApiKey, ApiKeySchema } from '../types/ApiKey';
import { Organization, OrganizationSchema } from '../types/Organization';
import { ScannerDeviceInfo } from '../types/ScannerDeviceInfo';
import { ScannerInvite, ScannerInviteSchema } from '../types/ScannerInvite';
import OrganizationDataStoresEndpoint from './organizations/DataStoresEndpoint';
import OrganizationExportersEndpoint from './organizations/ExportersEndpoint';
import OrganizationWebhooksEndpoint from './organizations/WebhooksEndpoint';
import Endpoint from './Endpoint';

/**
 * Communicate with the organizations endpoints.
 *
 * Top-level methods cover the org itself, scanner-invite handshake, and API keys. Resource
 * sub-endpoints (webhooks, dataStores, exporters) are exposed as `public readonly` props,
 * mirroring the composition pattern of {@link ../Client | Client}.
 */
export default class OrganizationsEndpoint extends Endpoint {
  /**
   * Webhook management (`/organization/webhooks*`).
   *
   * CRUD on webhooks plus access to the per-organization delivery log.
   */
  public readonly webhooks: OrganizationWebhooksEndpoint;

  /**
   * Data store management (`/organization/dataStores*`).
   *
   * CRUD on key/value and external-source data stores that workflows can read from.
   */
  public readonly dataStores: OrganizationDataStoresEndpoint;

  /**
   * Exporter management (`/organization/exporters*`).
   *
   * CRUD on scheduled exporters plus the ability to run an exporter on demand and tail
   * its execution logs.
   */
  public readonly exporters: OrganizationExportersEndpoint;

  /**
   * Constructor.
   *
   * @param req The object to use to make requests.
   */
  constructor(req: Requester) {
    super(req, '/organization');
    this.webhooks = new OrganizationWebhooksEndpoint(this);
    this.dataStores = new OrganizationDataStoresEndpoint(this);
    this.exporters = new OrganizationExportersEndpoint(this);
  }

  /**
   * Fetches the details of the authenticated organization.
   *
   * @returns The organization.
   */
  public getMine = async (): Promise<Organization> => {
    return await this.do.get('', OrganizationSchema);
  };

  /**
   * Returns a scanner invite by code.
   *
   * @param code The invite code.
   */
  public getScannerInvite = async (code: string): Promise<ScannerInvite | null> => {
    return await this.do.get(
      `/scanners/invites/${code}`,
      ScannerInviteSchema.nullable(),
      false,
    );
  };

  /**
   * Begins the scanner exchange.
   *
   * @param code The invite code.
   */
  public startScannerExchange = async (code: string): Promise<ScannerInvite | null> => {
    return await this.do.get(
      `/scanners/invites/${code}/start`,
      ScannerInviteSchema.nullable(),
      false,
    );
  };

  /**
   * Accepts an scanner app invite code and returns api keys.
   *
   * @param code The invite code.
   * @param pushToken The push token.
   * @param scannerDeviceInfo The scanner device info.
   */
  public finishScannerExchange = async (
    code: string,
    pushToken: string,
    scannerDeviceInfo: ScannerDeviceInfo,
  ): Promise<ApiKey> => {
    return await this.do.post(
      '/scanners/invites',
      {
        code,
        pushToken,
        scannerDeviceInfo,
      },
      ApiKeySchema,
      false,
    );
  };

  /**
   * Returns the API keys for the authenticated organization.
   */
  public getApiKeys = async (): Promise<ApiKey[]> => {
    return await this.do.get('/apiKeys', z.array(ApiKeySchema));
  };

  /**
   * Returns an API key by ID.
   *
   * @param id The ID of the API key.
   * @param scanner Optional scanner context — typed as `unknown` because the backend
   *   accepts any JSON-serializable value; defaults to the empty string.
   */
  public getApiKey = async (id: string, scanner: unknown = ''): Promise<ApiKey | null> => {
    const url = this.qb.create('/apiKeys/{id}')
      .addParam('id', id)
      .addQuery('scanner', JSON.stringify(scanner));

    return await this.do.get(url, ApiKeySchema.nullable());
  };

  /**
   * Deletes an API key.
   *
   * @param id The ID of the API key.
   */
  public deleteApiKey = async (id: string): Promise<void> => {
    return await this.do.del(`/apiKeys/${id}`);
  };
}
