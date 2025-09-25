/**
 * Entity for the workflowJobs collection.
 */
export interface WorkflowJob {
  /**
   * The job ID.
   */
  id: string;

  /**
   * The ID of the organization that owns the job.
   */
  organizationId: string;

  /**
   * The ID of the workflow that owns the job when applicable.
   */
  workflowId?: string;

  /**
   * The workflow code.
   */
  code: string;

  /**
   * The workflow context.
   */
  context: any;

  /**
   * The job status.
   */
  status: WorkflowJobStatus;

  /**
   * The number of seconds the job ran for.
   */
  runTime: number;

  /**
   * The last error that was thrown.
   */
  error: string | null;

  /**
   * The date the job was created.
   */
  createdDate: Date;
}

/**
 * The status of a workflow job.
 */
export type WorkflowJobStatus = 'pending' | 'running' | 'success' | 'error';
