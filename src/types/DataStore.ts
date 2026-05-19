import { z } from 'zod';

/**
 * Schema for the source of a data store.
 *
 * `key-value` stores embed their data inline; other source types pull from an external
 * system identified by `config`. Backend support is intentionally open-ended; the
 * schema accepts any string while the common ones autocomplete on the TypeScript side
 * via the union below.
 */
export const DataStoreSourceSchema = z.string();

/**
 * The source of a data store. Common values: `key-value`, `sftp`, `http`.
 */
export type DataStoreSource = 'key-value' | 'sftp' | 'http' | (string & {});

/**
 * Schema for a single key/value pair on a `key-value` data store.
 */
export const DataStoreKeyValueSchema = z
  .object({
    /**
     * The key.
     */
    key: z.string(),

    /**
     * The value, when present.
     */
    value: z.string().optional(),
  })
  .passthrough();

/**
 * A single key/value pair on a `key-value` data store.
 */
export type DataStoreKeyValue = z.infer<typeof DataStoreKeyValueSchema>;

/**
 * Schema for the body accepted by create/update on the data stores sub-endpoint.
 */
export const DataStoreInputSchema = z
  .object({
    /**
     * Human-readable name shown in the dashboard.
     */
    name: z.string(),

    /**
     * The data store's source type.
     */
    source: DataStoreSourceSchema,

    /**
     * Inline key/value pairs. Required when {@link source} is `'key-value'`.
     */
    keyValue: z.array(DataStoreKeyValueSchema).optional(),
  })
  .passthrough();

/**
 * Body accepted by create/update on the data stores sub-endpoint.
 */
export type DataStoreInput = z.infer<typeof DataStoreInputSchema> & { source: DataStoreSource };

/**
 * Schema for a data store owned by an organization.
 */
export const DataStoreSchema = DataStoreInputSchema.extend({
  /**
   * The ID of the data store.
   */
  id: z.string(),

  /**
   * The ID of the organization that owns the data store.
   */
  organization: z.string(),

  /**
   * The date the data store was created.
   */
  createdDate: z.coerce.date(),
}).passthrough();

/**
 * A data store owned by an organization.
 */
export type DataStore = z.infer<typeof DataStoreSchema> & { source: DataStoreSource };
