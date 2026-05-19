import { z } from 'zod';
import {
  WorkflowJob,
  WorkflowJobSchema,
  WorkflowJobStatus,
  WorkflowJobStatusSchema,
} from '../../types/WorkflowJob';
import { WorkflowMessage } from '../../types/WorkflowMessage';
import Endpoint from '../Endpoint';

/**
 * Communicate with the `/workflows/jobs*` sub-endpoints (and the workflow-scoped
 * `/workflows/:workflowId/jobs` listing).
 *
 * Accessed via `client.workflows.jobs`. In v1.x these methods lived on
 * `client.workflows.*` (`getJobs`, `getJob`, `updateJob`, `addJobLog`, `getJobStatus`);
 * they were moved to a dedicated sub-endpoint in v2 for consistency with the rest of
 * the SDK.
 */
export default class WorkflowJobsEndpoint extends Endpoint {
  /**
   * Constructor.
   *
   * @param parent The parent `WorkflowsEndpoint` whose `req`, `do`, and `qb` are
   *   reused.
   */
  constructor(parent: Endpoint) {
    super(parent);
  }

  /**
   * Returns the jobs for a workflow.
   *
   * @param workflowId The ID of the workflow.
   */
  public getAll = async (workflowId: string): Promise<WorkflowJob[]> => {
    return await this.do.get(`/${workflowId}/jobs`, z.array(WorkflowJobSchema));
  };

  /**
   * Returns the details for a job.
   *
   * @param jobId The ID of the job.
   */
  public getById = async (jobId: string): Promise<WorkflowJob> => {
    return await this.do.get(`/jobs/${jobId}`, WorkflowJobSchema);
  };

  /**
   * Updates a job.
   *
   * @param jobId The ID of the job.
   * @param body The job body.
   */
  public update = async (jobId: string, body: Partial<WorkflowJob>): Promise<WorkflowJob> => {
    return await this.do.post(`/jobs/${jobId}`, body, WorkflowJobSchema);
  };

  /**
   * Logs a message to a workflow job.
   *
   * @param jobId The ID of the job.
   * @param message The message to log.
   */
  public addLog = async (jobId: string, message: WorkflowMessage): Promise<WorkflowJob> => {
    return await this.do.post(`/jobs/${jobId}/logs`, message, WorkflowJobSchema);
  };

  /**
   * Returns the current status of a workflow job.
   *
   * @param jobId The ID of the workflow job.
   */
  public getStatus = async (jobId: string): Promise<WorkflowJobStatus> => {
    return await this.do.get(`/jobs/${jobId}/status`, WorkflowJobStatusSchema);
  };
}
