/**
 * Recurrence schedule for an exporter run.
 *
 * Mirrors the backend's `when` field on exporters.
 */
export type ExporterWhen =
  | 'manually'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | (string & {});

/**
 * Connection type used by an exporter.
 *
 * Backend support is open-ended; unknown strings are accepted while the common ones
 * autocomplete.
 */
export type ExporterSource = 'sftp' | 'ftp' | 'http' | 's3' | (string & {});

/**
 * Body accepted by create/update on the exporters sub-endpoint.
 */
export interface ExporterInput {
  /**
   * Human-readable name shown in the dashboard.
   */
  name: string;

  /**
   * What is being exported (e.g. `enrollments`, `claims`).
   */
  what: string;

  /**
   * When the export should run.
   */
  when: ExporterWhen;

  /**
   * The day of the week the export should run (when {@link when} is `weekly`).
   */
  weekday?: string;

  /**
   * The day of the month the export should run (when {@link when} is `monthly`).
   */
  monthday?: string;

  /**
   * The time of day the export should run, in `HH:mm` form.
   */
  time: string;

  /**
   * The connection type.
   */
  source: ExporterSource;

  /**
   * Source-specific configuration. Shape depends on {@link source}.
   */
  config: Record<string, any>;

  /**
   * Email addresses to notify when the export completes, as a comma-separated string.
   */
  notifications?: string;

  /**
   * Encryption type (e.g. `pgp`).
   */
  encryption?: string;

  /**
   * Encryption key, when {@link encryption} is set.
   *
   * For PGP, must begin with `-----BEGIN PGP PUBLIC KEY BLOCK-----`.
   */
  encryptionKey?: string;
}

/**
 * An exporter configured on an organization.
 */
export interface Exporter extends ExporterInput {
  /**
   * The ID of the exporter.
   */
  id: string;

  /**
   * The ID of the organization that owns the exporter.
   */
  organization: string;

  /**
   * The date the exporter was created.
   */
  createdDate: Date;
}
