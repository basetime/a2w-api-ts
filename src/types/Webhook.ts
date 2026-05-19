import { z } from 'zod';

/**
 * Schema for the events a webhook can subscribe to.
 *
 * Backend events are open-ended, so the schema accepts any string while the common
 * ones autocomplete via the TypeScript union below.
 */
export const WebhookEventSchema = z.string();

/**
 * The events a webhook can subscribe to.
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
 * Schema for the body accepted by create/update on the webhooks sub-endpoint.
 */
export const WebhookInputSchema = z
  .object({
    /**
     * Human-readable name shown in the dashboard.
     */
    displayName: z.string(),

    /**
     * The URL to POST to when the event fires.
     */
    url: z.string(),

    /**
     * The event that triggers the webhook.
     */
    event: WebhookEventSchema,

    /**
     * Optional shared secret. When set, the backend includes it in the request so the
     * receiver can verify the payload.
     */
    password: z.string().optional(),
  })
  .passthrough();

/**
 * Body accepted by create/update on the webhooks sub-endpoint.
 */
export type WebhookInput = z.infer<typeof WebhookInputSchema> & { event: WebhookEvent };

/**
 * Schema for a webhook configured on an organization.
 */
export const WebhookSchema = WebhookInputSchema.extend({
  /**
   * The ID of the webhook.
   */
  id: z.string(),

  /**
   * The ID of the organization that owns the webhook.
   */
  organization: z.string(),

  /**
   * Whether the webhook has been deleted.
   */
  isDeleted: z.boolean(),

  /**
   * The date the webhook was created.
   */
  createdDate: z.coerce.date(),
}).passthrough();

/**
 * A webhook configured on an organization.
 */
export type Webhook = z.infer<typeof WebhookSchema> & { event: WebhookEvent };
