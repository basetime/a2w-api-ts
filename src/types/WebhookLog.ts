import { z } from 'zod';

/**
 * Schema for a record of a webhook delivery attempt.
 *
 * Returned by `client.organizations.webhooks.getLogs()`. The exact shape of `payload`
 * and `response` is webhook-event specific and intentionally typed loosely.
 */
export const WebhookLogSchema = z
  .object({
    /**
     * The ID of the log entry.
     */
    id: z.string(),

    /**
     * The ID of the organization that owns the webhook.
     */
    organization: z.string(),

    /**
     * The ID of the webhook that was invoked.
     */
    webhook: z.string(),

    /**
     * The event that triggered the delivery.
     */
    event: z.string(),

    /**
     * The URL the request was sent to.
     */
    url: z.string(),

    /**
     * The HTTP status code returned by the receiver.
     */
    status: z.number(),

    /**
     * The payload that was sent.
     */
    payload: z.unknown(),

    /**
     * The response body returned by the receiver, when available.
     */
    response: z.unknown().optional(),

    /**
     * The date of the delivery attempt.
     */
    createdDate: z.coerce.date(),
  })
  .passthrough();

/**
 * A record of a webhook delivery attempt.
 */
export type WebhookLog = z.infer<typeof WebhookLogSchema>;
