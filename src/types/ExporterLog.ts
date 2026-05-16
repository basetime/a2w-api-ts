/**
 * Outcome of an exporter run.
 */
export type ExporterLogStatus = 'success' | 'error' | 'running' | (string & {});

/**
 * A record of an exporter execution.
 *
 * Returned by `client.organizations.exporters.getLogs(...)` and `getLog(...)`.
 */
export interface ExporterLog {
  /**
   * The ID of the log entry.
   */
  id: string;

  /**
   * The ID of the organization that owns the exporter.
   */
  organization: string;

  /**
   * The ID of the exporter that ran.
   */
  exporter: string;

  /**
   * Outcome of the run.
   */
  status: ExporterLogStatus;

  /**
   * Human-readable message describing the result.
   */
  message?: string;

  /**
   * Error string, when {@link status} is `'error'`.
   */
  error?: string | null;

  /**
   * Number of rows exported.
   */
  rowCount?: number;

  /**
   * Number of seconds the run took.
   */
  runTime?: number;

  /**
   * The date the run started.
   */
  createdDate: Date;
}
