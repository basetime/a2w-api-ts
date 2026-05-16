"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Endpoint_1 = __importDefault(require("./Endpoint"));
/**
 * The workflows endpoint.
 */
const endpoint = '/workflows';
/**
 * Communicate with the workflows endpoints.
 */
class WorkflowsEndpoint extends Endpoint_1.default {
    constructor() {
        super(...arguments);
        /**
         * Returns all of the workflows for authenticated organization.
         */
        this.getAll = async () => {
            return await this.doGet(endpoint);
        };
        /**
         * Returns the details of a workflow.
         *
         * @param id The ID of the workflow.
         */
        this.getById = async (id) => {
            return await this.doGet(`${endpoint}/${id}`);
        };
        /**
         * Creates a new workflow.
         *
         * @param workflow The workflow to create.
         */
        this.create = async (workflow) => {
            return await this.doPost(endpoint, workflow);
        };
        /**
         * Updates a workflow.
         *
         * @param workflowId The ID of the workflow.
         * @param workflow The workflow to update.
         */
        this.update = async (workflowId, workflow) => {
            return await this.doPost(`${endpoint}/${workflowId}`, workflow);
        };
        /**
         * Deletes a workflow.
         *
         * @param workflowId The ID of the workflow.
         */
        this.delete = async (workflowId) => {
            return await this.doDelete(`${endpoint}/${workflowId}`);
        };
        /**
         * Returns the jobs for a workflow.
         *
         * @param workflowId The ID of the workflow.
         */
        this.getJobs = async (workflowId) => {
            return await this.doGet(`${endpoint}/${workflowId}/jobs`);
        };
        /**
         * Returns the details for a job.
         *
         * @param jobId The ID of the job.
         */
        this.getJob = async (jobId) => {
            return await this.doGet(`${endpoint}/jobs/${jobId}`);
        };
        /**
         * Updates a job.
         *
         * @param jobId The ID of the job.
         * @param body The job body.
         */
        this.updateJob = async (jobId, body) => {
            return await this.doPost(`${endpoint}/jobs/${jobId}`, body);
        };
        /**
         * Logs a message to a workflow job.
         *
         * @param jobId The ID of the job.
         * @param message The message to log.
         */
        this.addJobLog = async (jobId, message) => {
            return await this.doPost(`${endpoint}/jobs/${jobId}/logs`, message);
        };
        /**
         * Returns the snippets for the authenticated organization.
         */
        this.getSnippets = async () => {
            return await this.doGet(`${endpoint}/libraries`);
        };
    }
}
exports.default = WorkflowsEndpoint;
