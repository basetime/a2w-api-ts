import { z } from 'zod';

/**
 * Schema for a scanner log entry recorded against a pass.
 *
 * Returned by `client.campaigns.passes.getScannerLogs(...)`. The exact set of fields is
 * defined on the backend and may grow over time; consult the backend repo (`scanners`
 * and `campaigns/passes` route handlers) for the canonical shape.
 */
export const ScannerLogSchema = z
  .object({
    /**
     * The ID of the log entry.
     */
    id: z.string(),

    /**
     * The ID of the API key the scan was made with.
     */
    apiKey: z.string(),

    /**
     * The ID of the pass that was scanned.
     */
    pass: z.string(),

    /**
     * The ID of the campaign the pass belongs to.
     */
    campaign: z.string(),

    /**
     * Arbitrary scanner-supplied data captured at scan time.
     */
    data: z.record(z.string(), z.unknown()),

    /**
     * The date the scan was recorded.
     */
    createdDate: z.coerce.date(),
  })
  .passthrough();

/**
 * A scanner log entry recorded against a pass.
 */
export type ScannerLog = z.infer<typeof ScannerLogSchema>;
