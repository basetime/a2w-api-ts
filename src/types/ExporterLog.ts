import { z } from 'zod';

/**
 * Schema for the outcome of an exporter run.
 */
export const ExporterLogStatusSchema = z.string();

/**
 * Outcome of an exporter run.
 */
export type ExporterLogStatus = 'success' | 'error' | 'running' | (string & {});

/**
 * Schema for a record of an exporter execution.
 *
 * Returned by `client.organizations.exporters.getLogs(...)` and `getLog(...)`.
 */
export const ExporterLogSchema = z
  .object({
    /**
     * The ID of the log entry.
     */
    id: z.string(),

    /**
     * The ID of the organization that owns the exporter.
     */
    organization: z.string(),

    /**
     * The ID of the exporter that ran.
     */
    exporter: z.string(),

    /**
     * Outcome of the run.
     */
    status: ExporterLogStatusSchema,

    /**
     * Human-readable message describing the result.
     */
    message: z.string().optional(),

    /**
     * Error string, when {@link status} is `'error'`.
     */
    error: z.string().nullable().optional(),

    /**
     * Number of rows exported.
     */
    rowCount: z.number().optional(),

    /**
     * Number of seconds the run took.
     */
    runTime: z.number().optional(),

    /**
     * The date the run started.
     */
    createdDate: z.coerce.date(),
  })
  .passthrough();

/**
 * A record of an exporter execution.
 */
export type ExporterLog = z.infer<typeof ExporterLogSchema> & { status: ExporterLogStatus };
