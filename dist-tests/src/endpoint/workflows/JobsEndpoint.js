"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const WorkflowJob_1 = require("../../types/WorkflowJob");
const Endpoint_1 = __importDefault(require("../Endpoint"));
/**
 * Communicate with the `/workflows/jobs*` sub-endpoints (and the workflow-scoped
 * `/workflows/:workflowId/jobs` listing).
 *
 * Accessed via `client.workflows.jobs`. In v1.x these methods lived on
 * `client.workflows.*` (`getJobs`, `getJob`, `updateJob`, `addJobLog`, `getJobStatus`);
 * they were moved to a dedicated sub-endpoint in v2 for consistency with the rest of
 * the SDK.
 */
class WorkflowJobsEndpoint extends Endpoint_1.default {
    /**
     * Constructor.
     *
     * @param parent The parent `WorkflowsEndpoint` whose `req`, `do`, and `qb` are
     *   reused.
     */
    constructor(parent) {
        super(parent);
        /**
         * Returns the jobs for a workflow.
         *
         * @param workflowId The ID of the workflow.
         */
        this.getAll = async (workflowId) => {
            return await this.do.get(`/${workflowId}/jobs`, zod_1.z.array(WorkflowJob_1.WorkflowJobSchema));
        };
        /**
         * Returns the details for a job.
         *
         * @param jobId The ID of the job.
         */
        this.getById = async (jobId) => {
            return await this.do.get(`/jobs/${jobId}`, WorkflowJob_1.WorkflowJobSchema);
        };
        /**
         * Updates a job.
         *
         * @param jobId The ID of the job.
         * @param body The job body.
         */
        this.update = async (jobId, body) => {
            return await this.do.post(`/jobs/${jobId}`, body, WorkflowJob_1.WorkflowJobSchema);
        };
        /**
         * Logs a message to a workflow job.
         *
         * @param jobId The ID of the job.
         * @param message The message to log.
         */
        this.addLog = async (jobId, message) => {
            return await this.do.post(`/jobs/${jobId}/logs`, message, WorkflowJob_1.WorkflowJobSchema);
        };
        /**
         * Returns the current status of a workflow job.
         *
         * @param jobId The ID of the workflow job.
         */
        this.getStatus = async (jobId) => {
            return await this.do.get(`/jobs/${jobId}/status`, WorkflowJob_1.WorkflowJobStatusSchema);
        };
    }
}
exports.default = WorkflowJobsEndpoint;
