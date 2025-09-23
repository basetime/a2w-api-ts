import { Workflow } from '../types/Workflow';
import { WorkflowJob } from '../types/WorkflowJob';
import { WorkflowMessage } from '../types/WorkflowMessage';
import Endpoint from './Endpoint';

/**
 * The workflows endpoint.
 */
const endpoint = '/workflows';

/**
 * Communicate with the workflows endpoints.
 */
export default class WorkflowsEndpoint extends Endpoint {
  /**
   * Returns all of the workflows for authenticated organization.
   */
  public getAll = async (): Promise<Workflow[]> => {
    return await this.doGet<Workflow[]>(endpoint);
  };

  /**
   * Returns the details of a workflow.
   *
   * @param id The ID of the workflow.
   */
  public getById = async (id: string): Promise<Workflow> => {
    return await this.doGet<Workflow>(`${endpoint}/${id}`);
  };

  /**
   * Creates a new workflow.
   *
   * @param workflow The workflow to create.
   */
  public create = async (workflow: Omit<Workflow, 'id' | 'createdDate'>): Promise<Workflow> => {
    return await this.doPost<Workflow>(endpoint, workflow);
  };

  /**
   * Updates a workflow.
   *
   * @param workflowId The ID of the workflow.
   * @param workflow The workflow to update.
   */
  public update = async (workflowId: string, workflow: Partial<Workflow>): Promise<Workflow> => {
    return await this.doPost<Workflow>(`${endpoint}/${workflowId}`, workflow);
  };

  /**
   * Deletes a workflow.
   *
   * @param workflowId The ID of the workflow.
   */
  public delete = async (workflowId: string): Promise<void> => {
    return await this.doDelete<void>(`${endpoint}/${workflowId}`);
  };

  /**
   * Returns the jobs for a workflow.
   *
   * @param workflowId The ID of the workflow.
   */
  public getJobs = async (workflowId: string): Promise<WorkflowJob[]> => {
    return await this.doGet<WorkflowJob[]>(`${endpoint}/${workflowId}/jobs`);
  };

  /**
   * Returns the details for a job.
   *
   * @param jobId The ID of the job.
   */
  public getJob = async (jobId: string): Promise<WorkflowJob> => {
    return await this.doGet<WorkflowJob>(`${endpoint}/jobs/${jobId}`);
  };

  /**
   * Updates a job.
   *
   * @param jobId The ID of the job.
   * @param body The job body.
   */
  public updateJob = async (jobId: string, body: Partial<WorkflowJob>): Promise<WorkflowJob> => {
    return await this.doPost<WorkflowJob>(`${endpoint}/jobs/${jobId}`, body);
  };

  /**
   * Logs a message to a workflow job.
   *
   * @param jobId The ID of the job.
   * @param message The message to log.
   */
  public addJobLog = async (jobId: string, message: WorkflowMessage): Promise<WorkflowJob> => {
    return await this.doPost<WorkflowJob>(`${endpoint}/jobs/${jobId}/logs`, message);
  };
}
