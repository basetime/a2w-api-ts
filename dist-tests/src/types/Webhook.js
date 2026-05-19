"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookSchema = exports.WebhookInputSchema = exports.WebhookEventSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for the events a webhook can subscribe to.
 *
 * Backend events are open-ended, so the schema accepts any string while the common
 * ones autocomplete via the TypeScript union below.
 */
exports.WebhookEventSchema = zod_1.z.string();
/**
 * Schema for the body accepted by create/update on the webhooks sub-endpoint.
 */
exports.WebhookInputSchema = zod_1.z
    .object({
    /**
     * Human-readable name shown in the dashboard.
     */
    displayName: zod_1.z.string(),
    /**
     * The URL to POST to when the event fires.
     */
    url: zod_1.z.string(),
    /**
     * The event that triggers the webhook.
     */
    event: exports.WebhookEventSchema,
    /**
     * Optional shared secret. When set, the backend includes it in the request so the
     * receiver can verify the payload.
     */
    password: zod_1.z.string().optional(),
})
    .passthrough();
/**
 * Schema for a webhook configured on an organization.
 */
exports.WebhookSchema = exports.WebhookInputSchema.extend({
    /**
     * The ID of the webhook.
     */
    id: zod_1.z.string(),
    /**
     * The ID of the organization that owns the webhook.
     */
    organization: zod_1.z.string(),
    /**
     * Whether the webhook has been deleted.
     */
    isDeleted: zod_1.z.boolean(),
    /**
     * The date the webhook was created.
     */
    createdDate: zod_1.z.coerce.date(),
}).passthrough();
