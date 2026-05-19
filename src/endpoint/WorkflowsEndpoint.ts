import { z } from 'zod';
import { Requester } from '../http/Requester';
import { SnippetLibrary, SnippetLibrarySchema } from '../types/SnippetLibrary';
import { Workflow, WorkflowSchema } from '../types/Workflow';
import { WorkflowJob, WorkflowJobSchema } from '../types/WorkflowJob';
import Endpoint from './Endpoint';
import WorkflowJobsEndpoint from './workflows/JobsEndpoint';

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
 *
 * Per-job operations (read, update, status polling, log appending) have moved to
 * `client.workflows.jobs.*` in v2 — see {@link WorkflowJobsEndpoint}.
 */
export default class WorkflowsEndpoint extends Endpoint {
  /**
   * Job operations for workflows (`/workflows/jobs/*` and the workflow-scoped
   * `/workflows/:workflowId/jobs` listing).
   */
  public readonly jobs: WorkflowJobsEndpoint;

  /**
   * Constructor.
   *
   * @param req The object to use to make requests.
   */
  constructor(req: Requester) {
    super(req, '/workflows');
    this.jobs = new WorkflowJobsEndpoint(this);
  }

  /**
   * Returns all of the workflows for authenticated organization.
   */
  public getAll = async (): Promise<Workflow[]> => {
    return await this.do.get('', z.array(WorkflowSchema));
  };

  /**
   * Returns the details of a workflow.
   *
   * @param id The ID of the workflow.
   */
  public getById = async (id: string): Promise<Workflow> => {
    return await this.do.get(`/${id}`, WorkflowSchema);
  };

  /**
   * Creates a new workflow.
   *
   * @param workflow The workflow to create.
   */
  public create = async (workflow: Omit<Workflow, 'id' | 'createdDate'>): Promise<Workflow> => {
    return await this.do.post('', workflow, WorkflowSchema);
  };

  /**
   * Updates a workflow.
   *
   * @param workflowId The ID of the workflow.
   * @param workflow The workflow to update.
   */
  public update = async (workflowId: string, workflow: Partial<Workflow>): Promise<Workflow> => {
    return await this.do.post(`/${workflowId}`, workflow, WorkflowSchema);
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
   * Returns the snippets for the authenticated organization.
   */
  public getSnippets = async (): Promise<SnippetLibrary[]> => {
    return await this.do.get('/libraries', z.array(SnippetLibrarySchema));
  };

  /**
   * Runs a workflow.
   *
   * Creates a new {@link WorkflowJob} and dispatches it to the workflow runner. The returned
   * job will be in the `pending` status; poll `client.workflows.jobs.getStatus(jobId)`
   * to track progress.
   *
   * @param body The run request.
   */
  public run = async (body: WorkflowRunBody): Promise<WorkflowJob> => {
    return await this.do.post('/run', body, WorkflowJobSchema);
  };
}
