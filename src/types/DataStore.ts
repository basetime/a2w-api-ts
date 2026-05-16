/**
 * The source of a data store.
 *
 * `key-value` stores embed their data inline; other source types pull from an external
 * system identified by `config`. Backend support is intentionally open-ended; unknown
 * strings are accepted while the common ones autocomplete.
 */
export type DataStoreSource = 'key-value' | 'sftp' | 'http' | (string & {});

/**
 * A single key/value pair on a `key-value` data store.
 */
export interface DataStoreKeyValue {
  /**
   * The key.
   */
  key: string;

  /**
   * The value, when present.
   */
  value?: string;
}

/**
 * Body accepted by create/update on the data stores sub-endpoint.
 */
export interface DataStoreInput {
  /**
   * Human-readable name shown in the dashboard.
   */
  name: string;

  /**
   * The data store's source type.
   */
  source: DataStoreSource;

  /**
   * Inline key/value pairs. Required when {@link source} is `'key-value'`.
   */
  keyValue?: DataStoreKeyValue[];
}

/**
 * A data store owned by an organization.
 */
export interface DataStore extends DataStoreInput {
  /**
   * The ID of the data store.
   */
  id: string;

  /**
   * The ID of the organization that owns the data store.
   */
  organization: string;

  /**
   * The date the data store was created.
   */
  createdDate: Date;
}
