/**
 * A scanner log entry recorded against a pass.
 *
 * Returned by `client.campaigns.passes.getScannerLogs(...)`. The exact set of fields is
 * defined on the backend and may grow over time; consult the backend repo (`scanners`
 * and `campaigns/passes` route handlers) for the canonical shape.
 */
export interface ScannerLog {
  /**
   * The ID of the log entry.
   */
  id: string;

  /**
   * The ID of the API key the scan was made with.
   */
  apiKey: string;

  /**
   * The ID of the pass that was scanned.
   */
  pass: string;

  /**
   * The ID of the campaign the pass belongs to.
   */
  campaign: string;

  /**
   * Arbitrary scanner-supplied data captured at scan time.
   */
  data: Record<string, any>;

  /**
   * The date the scan was recorded.
   */
  createdDate: Date;
}
