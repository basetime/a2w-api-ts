import { Requester } from '../http/Requester';
import { SnippetLibrary } from '../types/SnippetLibrary';
import { Workflow } from '../types/Workflow';
import { WorkflowJob, WorkflowJobStatus } from '../types/WorkflowJob';
import { WorkflowMessage } from '../types/WorkflowMessage';
import Endpoint from './Endpoint';

/**
 * Body accepted by {@link WorkflowsEndpoint.run}.
 *
 * `workflowId` selects the workflow to execute; `code` is an optional override that lets
 * callers run an edited copy of the workflow without persisting the change.
 * `campaign` and `pass` populate the workflow's runtime context.
 */
export interface WorkflowRunBody {
  /**
   * The ID of the workflow to run.
   */
  workflowId: string;

  /**
   * Optional code override. When omitted the workflow's stored code is used.
   */
  code?: string;

  /**
   * Optional campaign ID to inject into the workflow context.
   */
  campaign?: string;

  /**
   * Optional pass ID to inject into the workflow context. Requires `campaign`.
   */
  pass?: string;
}

/**
 * Communicate with the workflows endpoints.
 */
export default class WorkflowsEndpoint extends Endpoint {
  /**
   * Constructor.
   *
   * @param req The object to use to make requests.
   */
  constructor(req: Requester) {
    super(req, '/workflows');
  }

  /**
   * Returns all of the workflows for authenticated organization.
   */
  public getAll = async (): Promise<Workflow[]> => {
    return await this.do.get('');
  };

  /**
   * Returns the details of a workflow.
   *
   * @param id The ID of the workflow.
   */
  public getById = async (id: string): Promise<Workflow> => {
    return await this.do.get(`/${id}`);
  };

  /**
   * Creates a new workflow.
   *
   * @param workflow The workflow to create.
   */
  public create = async (workflow: Omit<Workflow, 'id' | 'createdDate'>): Promise<Workflow> => {
    return await this.do.post('', workflow);
  };

  /**
   * Updates a workflow.
   *
   * @param workflowId The ID of the workflow.
   * @param workflow The workflow to update.
   */
  public update = async (workflowId: string, workflow: Partial<Workflow>): Promise<Workflow> => {
    return await this.do.post(`/${workflowId}`, workflow);
  };

  /**
   * Deletes a workflow.
   *
   * @param workflowId The ID of the workflow.
   */
  public delete = async (workflowId: string): Promise<void> => {
    return await this.do.del(`/${workflowId}`);
  };

  /**
   * Returns the jobs for a workflow.
   *
   * @param workflowId The ID of the workflow.
   */
  public getJobs = async (workflowId: string): Promise<WorkflowJob[]> => {
    return await this.do.get(`/${workflowId}/jobs`);
  };

  /**
   * Returns the details for a job.
   *
   * @param jobId The ID of the job.
   */
  public getJob = async (jobId: string): Promise<WorkflowJob> => {
    return await this.do.get(`/jobs/${jobId}`);
  };

  /**
   * Updates a job.
   *
   * @param jobId The ID of the job.
   * @param body The job body.
   */
  public updateJob = async (jobId: string, body: Partial<WorkflowJob>): Promise<WorkflowJob> => {
    return await this.do.post(`/jobs/${jobId}`, body);
  };

  /**
   * Logs a message to a workflow job.
   *
   * @param jobId The ID of the job.
   * @param message The message to log.
   */
  public addJobLog = async (jobId: string, message: WorkflowMessage): Promise<WorkflowJob> => {
    return await this.do.post(`/jobs/${jobId}/logs`, message);
  };

  /**
   * Returns the snippets for the authenticated organization.
   */
  public getSnippets = async (): Promise<SnippetLibrary[]> => {
    return await this.do.get('/libraries');
  };

  /**
   * Runs a workflow.
   *
   * Creates a new {@link WorkflowJob} and dispatches it to the workflow runner. The returned
   * job will be in the `pending` status; poll {@link getJobStatus} to track progress.
   *
   * @param body The run request.
   */
  public run = async (body: WorkflowRunBody): Promise<WorkflowJob> => {
    return await this.do.post('/run', body);
  };

  /**
   * Returns the current status of a workflow job.
   *
   * @param jobId The ID of the workflow job.
   */
  public getJobStatus = async (jobId: string): Promise<WorkflowJobStatus> => {
    return await this.do.get(`/jobs/${jobId}/status`);
  };
}
