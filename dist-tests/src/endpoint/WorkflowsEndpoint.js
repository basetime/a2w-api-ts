"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const SnippetLibrary_1 = require("../types/SnippetLibrary");
const Workflow_1 = require("../types/Workflow");
const WorkflowJob_1 = require("../types/WorkflowJob");
const Endpoint_1 = __importDefault(require("./Endpoint"));
const JobsEndpoint_1 = __importDefault(require("./workflows/JobsEndpoint"));
/**
 * Communicate with the workflows endpoints.
 *
 * Per-job operations (read, update, status polling, log appending) have moved to
 * `client.workflows.jobs.*` in v2 — see {@link WorkflowJobsEndpoint}.
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
            return await this.do.get('', zod_1.z.array(Workflow_1.WorkflowSchema));
        };
        /**
         * Returns the details of a workflow.
         *
         * @param id The ID of the workflow.
         */
        this.getById = async (id) => {
            return await this.do.get(`/${id}`, Workflow_1.WorkflowSchema);
        };
        /**
         * Creates a new workflow.
         *
         * @param workflow The workflow to create.
         */
        this.create = async (workflow) => {
            return await this.do.post('', workflow, Workflow_1.WorkflowSchema);
        };
        /**
         * Updates a workflow.
         *
         * @param workflowId The ID of the workflow.
         * @param workflow The workflow to update.
         */
        this.update = async (workflowId, workflow) => {
            return await this.do.post(`/${workflowId}`, workflow, Workflow_1.WorkflowSchema);
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
         * Returns the snippets for the authenticated organization.
         */
        this.getSnippets = async () => {
            return await this.do.get('/libraries', zod_1.z.array(SnippetLibrary_1.SnippetLibrarySchema));
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
        this.run = async (body) => {
            return await this.do.post('/run', body, WorkflowJob_1.WorkflowJobSchema);
        };
        this.jobs = new JobsEndpoint_1.default(this);
    }
}
exports.default = WorkflowsEndpoint;
