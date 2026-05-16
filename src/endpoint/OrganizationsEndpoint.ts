import { Requester } from '../http/Requester';
import { ApiKey } from '../types/ApiKey';
import { Organization } from '../types/Organization';
import { ScannerDeviceInfo } from '../types/ScannerDeviceInfo';
import { ScannerInvite } from '../types/ScannerInvite';
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
    this.webhooks = new OrganizationWebhooksEndpoint(req);
    this.dataStores = new OrganizationDataStoresEndpoint(req);
    this.exporters = new OrganizationExportersEndpoint(req);
  }

  /**
   * Fetches the details of the authenticated organization.
   *
   * @returns The organization.
   */
  public getMine = async (): Promise<Organization> => {
    return await this.do.get('');
  };

  /**
   * Returns a scanner invite by code.
   *
   * @param code The invite code.
   */
  public getScannerInvite = async (code: string): Promise<ScannerInvite | null> => {
    return await this.do.get(`/scanners/invites/${code}`, false);
  };

  /**
   * Begins the scanner exchange.
   *
   * @param code The invite code.
   */
  public startScannerExchange = async (code: string): Promise<ScannerInvite | null> => {
    return await this.do.get(`/scanners/invites/${code}/start`, false);
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
      false,
    );
  };

  /**
   * Returns the API keys for the authenticated organization.
   */
  public getApiKeys = async (): Promise<ApiKey[]> => {
    return await this.do.get('/apiKeys');
  };

  /**
   * Returns an API key by ID.
   *
   * @param id The ID of the API key.
   */
  public getApiKey = async (id: string, scanner: any = ''): Promise<ApiKey | null> => {
    const url = this.qb.create('/apiKeys/{id}')
      .addParam('id', id)
      .addQuery('scanner', JSON.stringify(scanner));

    return await this.do.get(url);
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
