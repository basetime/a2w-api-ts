"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Endpoint_1 = __importDefault(require("./Endpoint"));
/**
 * Communicate with the workflows endpoints.
 */
class WorkflowsEndpoint extends Endpoint_1.default {
    /**
     * Constructor.
     *
     * @param req The object to use to make requests.
     */
    constructor(req) {
        super(req, '/workflows');
        /**
         * Returns all of the workflows for authenticated organization.
         */
        this.getAll = async () => {
            return await this.do.get('');
        };
        /**
         * Returns the details of a workflow.
         *
         * @param id The ID of the workflow.
         */
        this.getById = async (id) => {
            return await this.do.get(`/${id}`);
        };
        /**
         * Creates a new workflow.
         *
         * @param workflow The workflow to create.
         */
        this.create = async (workflow) => {
            return await this.do.post('', workflow);
        };
        /**
         * Updates a workflow.
         *
         * @param workflowId The ID of the workflow.
         * @param workflow The workflow to update.
         */
        this.update = async (workflowId, workflow) => {
            return await this.do.post(`/${workflowId}`, workflow);
        };
        /**
         * Deletes a workflow.
         *
         * @param workflowId The ID of the workflow.
         */
        this.delete = async (workflowId) => {
            return await this.do.del(`/${workflowId}`);
        };
        /**
         * Returns the jobs for a workflow.
         *
         * @param workflowId The ID of the workflow.
         */
        this.getJobs = async (workflowId) => {
            return await this.do.get(`/${workflowId}/jobs`);
        };
        /**
         * Returns the details for a job.
         *
         * @param jobId The ID of the job.
         */
        this.getJob = async (jobId) => {
            return await this.do.get(`/jobs/${jobId}`);
        };
        /**
         * Updates a job.
         *
         * @param jobId The ID of the job.
         * @param body The job body.
         */
        this.updateJob = async (jobId, body) => {
            return await this.do.post(`/jobs/${jobId}`, body);
        };
        /**
         * Logs a message to a workflow job.
         *
         * @param jobId The ID of the job.
         * @param message The message to log.
         */
        this.addJobLog = async (jobId, message) => {
            return await this.do.post(`/jobs/${jobId}/logs`, message);
        };
        /**
         * Returns the snippets for the authenticated organization.
         */
        this.getSnippets = async () => {
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
        this.run = async (body) => {
            return await this.do.post('/run', body);
        };
        /**
         * Returns the current status of a workflow job.
         *
         * @param jobId The ID of the workflow job.
         */
        this.getJobStatus = async (jobId) => {
            return await this.do.get(`/jobs/${jobId}/status`);
        };
    }
}
exports.default = WorkflowsEndpoint;
