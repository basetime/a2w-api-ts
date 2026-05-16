/**
 * The events a webhook can subscribe to.
 *
 * Backend events are open-ended, so unknown strings are also accepted at the type level
 * while still autocompleting the common ones.
 */
export type WebhookEvent =
  | 'enrolled'
  | 'claimed'
  | 'installed'
  | 'redeemed'
  | 'updated'
  | 'scanned'
  | 'pushed'
  | 'deleted'
  | (string & {});

/**
 * Body accepted by create/update on the webhooks sub-endpoint.
 */
export interface WebhookInput {
  /**
   * Human-readable name shown in the dashboard.
   */
  displayName: string;

  /**
   * The URL to POST to when the event fires.
   */
  url: string;

  /**
   * The event that triggers the webhook.
   */
  event: WebhookEvent;

  /**
   * Optional shared secret. When set, the backend includes it in the request so the
   * receiver can verify the payload.
   */
  password?: string;
}

/**
 * A webhook configured on an organization.
 */
export interface Webhook extends WebhookInput {
  /**
   * The ID of the webhook.
   */
  id: string;

  /**
   * The ID of the organization that owns the webhook.
   */
  organization: string;

  /**
   * Whether the webhook has been deleted.
   */
  isDeleted: boolean;

  /**
   * The date the webhook was created.
   */
  createdDate: Date;
}
