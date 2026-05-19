"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataStoreSchema = exports.DataStoreInputSchema = exports.DataStoreKeyValueSchema = exports.DataStoreSourceSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for the source of a data store.
 *
 * `key-value` stores embed their data inline; other source types pull from an external
 * system identified by `config`. Backend support is intentionally open-ended; the
 * schema accepts any string while the common ones autocomplete on the TypeScript side
 * via the union below.
 */
exports.DataStoreSourceSchema = zod_1.z.string();
/**
 * Schema for a single key/value pair on a `key-value` data store.
 */
exports.DataStoreKeyValueSchema = zod_1.z
    .object({
    /**
     * The key.
     */
    key: zod_1.z.string(),
    /**
     * The value, when present.
     */
    value: zod_1.z.string().optional(),
})
    .passthrough();
/**
 * Schema for the body accepted by create/update on the data stores sub-endpoint.
 */
exports.DataStoreInputSchema = zod_1.z
    .object({
    /**
     * Human-readable name shown in the dashboard.
     */
    name: zod_1.z.string(),
    /**
     * The data store's source type.
     */
    source: exports.DataStoreSourceSchema,
    /**
     * Inline key/value pairs. Required when {@link source} is `'key-value'`.
     */
    keyValue: zod_1.z.array(exports.DataStoreKeyValueSchema).optional(),
})
    .passthrough();
/**
 * Schema for a data store owned by an organization.
 */
exports.DataStoreSchema = exports.DataStoreInputSchema.extend({
    /**
     * The ID of the data store.
     */
    id: zod_1.z.string(),
    /**
     * The ID of the organization that owns the data store.
     */
    organization: zod_1.z.string(),
    /**
     * The date the data store was created.
     */
    createdDate: zod_1.z.coerce.date(),
}).passthrough();
