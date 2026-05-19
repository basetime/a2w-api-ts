"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowJobSchema = exports.WorkflowJobStatusSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for the status of a workflow job.
 */
exports.WorkflowJobStatusSchema = zod_1.z.enum(['pending', 'running', 'success', 'error']);
/**
 * Schema for a workflow job.
 */
exports.WorkflowJobSchema = zod_1.z
    .object({
    /**
     * The job ID.
     */
    id: zod_1.z.string(),
    /**
     * The ID of the organization that owns the job.
     */
    organizationId: zod_1.z.string(),
    /**
     * The ID of the workflow that owns the job when applicable.
     */
    workflowId: zod_1.z.string().optional(),
    /**
     * The workflow code.
     */
    code: zod_1.z.string(),
    /**
     * The workflow context.
     */
    context: zod_1.z.unknown(),
    /**
     * The job status.
     */
    status: exports.WorkflowJobStatusSchema,
    /**
     * The number of seconds the job ran for.
     */
    runTime: zod_1.z.number(),
    /**
     * The last error that was thrown.
     */
    error: zod_1.z.string().nullable(),
    /**
     * The date the job was created.
     */
    createdDate: zod_1.z.coerce.date(),
})
    .passthrough();
