"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobSchema = exports.TaskSchema = exports.JobModeSchema = exports.JobStatusSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for the status of a job.
 */
exports.JobStatusSchema = zod_1.z.enum(['preparing', 'running', 'success', 'failed']);
/**
 * Schema for the mode of a job.
 */
exports.JobModeSchema = zod_1.z.enum(['import', 'export']);
/**
 * Schema for a task in the job.
 */
exports.TaskSchema = zod_1.z
    .object({
    /**
     * The ID of the task.
     */
    id: zod_1.z.string(),
    /**
     * Are we importing or exporting?
     */
    mode: exports.JobModeSchema,
    /**
     * The ID of the installed integration that processes the task.
     */
    integration: zod_1.z.string(),
    /**
     * The task configuration.
     */
    config: zod_1.z.unknown(),
    /**
     * The cloud file that's the input for the task.
     */
    inputFile: zod_1.z.string(),
    /**
     * The cloud file that's the output for the task.
     */
    outputFile: zod_1.z.string(),
    /**
     * The status of the task.
     */
    status: exports.JobStatusSchema,
    /**
     * The error message if the task failed.
     */
    error: zod_1.z.string().optional(),
    /**
     * The number of rows affected by the task.
     */
    rowsAffected: zod_1.z.number(),
    /**
     * The date the task was created.
     */
    createdDate: zod_1.z.coerce.date(),
    /**
     * The date the task finished.
     */
    finishedDate: zod_1.z.coerce.date().nullable(),
})
    .passthrough();
/**
 * Schema for the details of a running job.
 */
exports.JobSchema = zod_1.z
    .object({
    /**
     * The ID of the job.
     */
    id: zod_1.z.string(),
    /**
     * The job status.
     */
    status: exports.JobStatusSchema,
    /**
     * Error message if the job failed.
     */
    error: zod_1.z.string().optional(),
    /**
     * The tasks in the job.
     */
    tasks: zod_1.z.array(exports.TaskSchema),
    /**
     * The number of passes in the job.
     */
    passesCount: zod_1.z.number(),
    /**
     * Log messages for the job.
     */
    logs: zod_1.z.array(zod_1.z.string()),
    /**
     * The date the job finished.
     */
    finishedDate: zod_1.z.coerce.date().nullable(),
    /**
     * The date the job was created.
     */
    createdDate: zod_1.z.coerce.date(),
})
    .passthrough();
