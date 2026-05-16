import { Requester } from '../../http/Requester';
import { Webhook, WebhookInput } from '../../types/Webhook';
import { WebhookLog } from '../../types/WebhookLog';
import Endpoint from '../Endpoint';

/**
 * Communicate with the `/organization/webhooks*` sub-endpoints.
 *
 * Accessed via `client.organizations.webhooks`. Provides CRUD over an organization's
 * webhooks and access to the per-organization delivery log.
 */
export default class OrganizationWebhooksEndpoint extends Endpoint {
  /**
   * Constructor.
   *
   * @param req The object to use to make requests.
   */
  constructor(req: Requester) {
    super(req, '/organization');
  }

  /**
   * Returns all webhooks for the authenticated organization.
   */
  public getAll = async (): Promise<Webhook[]> => {
    return await this.do.get('/webhooks');
  };

  /**
   * Creates a new webhook.
   *
   * @param body The webhook to create.
   */
  public create = async (body: WebhookInput): Promise<Webhook> => {
    return await this.do.post('/webhooks', body);
  };

  /**
   * Updates an existing webhook.
   *
   * @param id The ID of the webhook to update.
   * @param body The new webhook values.
   */
  public update = async (id: string, body: WebhookInput): Promise<Webhook> => {
    return await this.do.post(`/webhooks/${id}`, body);
  };

  /**
   * Deletes a webhook.
   *
   * @param id The ID of the webhook to delete.
   */
  public delete = async (id: string): Promise<string> => {
    return await this.do.del(`/webhooks/${id}`);
  };

  /**
   * Returns the delivery logs for all webhooks owned by the authenticated organization.
   */
  public getLogs = async (): Promise<WebhookLog[]> => {
    return await this.do.get('/webhookLogs');
  };
}
