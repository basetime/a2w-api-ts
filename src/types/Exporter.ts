import { z } from 'zod';

/**
 * Schema for the recurrence schedule of an exporter run.
 */
export const ExporterWhenSchema = z.string();

/**
 * Recurrence schedule for an exporter run.
 */
export type ExporterWhen =
  | 'manually'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | (string & {});

/**
 * Schema for the connection type used by an exporter.
 */
export const ExporterSourceSchema = z.string();

/**
 * Connection type used by an exporter.
 *
 * Backend support is open-ended; the schema accepts any string while the common ones
 * autocomplete via the TypeScript union below.
 */
export type ExporterSource = 'sftp' | 'ftp' | 'http' | 's3' | (string & {});

/**
 * Schema for the body accepted by create/update on the exporters sub-endpoint.
 */
export const ExporterInputSchema = z
  .object({
    /**
     * Human-readable name shown in the dashboard.
     */
    name: z.string(),

    /**
     * What is being exported (e.g. `enrollments`, `claims`).
     */
    what: z.string(),

    /**
     * When the export should run.
     */
    when: ExporterWhenSchema,

    /**
     * The day of the week the export should run (when {@link when} is `weekly`).
     */
    weekday: z.string().optional(),

    /**
     * The day of the month the export should run (when {@link when} is `monthly`).
     */
    monthday: z.string().optional(),

    /**
     * The time of day the export should run, in `HH:mm` form.
     */
    time: z.string(),

    /**
     * The connection type.
     */
    source: ExporterSourceSchema,

    /**
     * Source-specific configuration. Shape depends on {@link source}.
     */
    config: z.record(z.string(), z.unknown()),

    /**
     * Email addresses to notify when the export completes, as a comma-separated string.
     */
    notifications: z.string().optional(),

    /**
     * Encryption type (e.g. `pgp`).
     */
    encryption: z.string().optional(),

    /**
     * Encryption key, when {@link encryption} is set.
     *
     * For PGP, must begin with `-----BEGIN PGP PUBLIC KEY BLOCK-----`.
     */
    encryptionKey: z.string().optional(),
  })
  .passthrough();

/**
 * Body accepted by create/update on the exporters sub-endpoint.
 */
export type ExporterInput = z.infer<typeof ExporterInputSchema> & {
  when: ExporterWhen;
  source: ExporterSource;
};

/**
 * Schema for an exporter configured on an organization.
 */
export const ExporterSchema = ExporterInputSchema.extend({
  /**
   * The ID of the exporter.
   */
  id: z.string(),

  /**
   * The ID of the organization that owns the exporter.
   */
  organization: z.string(),

  /**
   * The date the exporter was created.
   */
  createdDate: z.coerce.date(),
}).passthrough();

/**
 * An exporter configured on an organization.
 */
export type Exporter = z.infer<typeof ExporterSchema> & {
  when: ExporterWhen;
  source: ExporterSource;
};
