"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookLogSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for a record of a webhook delivery attempt.
 *
 * Returned by `client.organizations.webhooks.getLogs()`. The exact shape of `payload`
 * and `response` is webhook-event specific and intentionally typed loosely.
 */
exports.WebhookLogSchema = zod_1.z
    .object({
    /**
     * The ID of the log entry.
     */
    id: zod_1.z.string(),
    /**
     * The ID of the organization that owns the webhook.
     */
    organization: zod_1.z.string(),
    /**
     * The ID of the webhook that was invoked.
     */
    webhook: zod_1.z.string(),
    /**
     * The event that triggered the delivery.
     */
    event: zod_1.z.string(),
    /**
     * The URL the request was sent to.
     */
    url: zod_1.z.string(),
    /**
     * The HTTP status code returned by the receiver.
     */
    status: zod_1.z.number(),
    /**
     * The payload that was sent.
     */
    payload: zod_1.z.unknown(),
    /**
     * The response body returned by the receiver, when available.
     */
    response: zod_1.z.unknown().optional(),
    /**
     * The date of the delivery attempt.
     */
    createdDate: zod_1.z.coerce.date(),
})
    .passthrough();
