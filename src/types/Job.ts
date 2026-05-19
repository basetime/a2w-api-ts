import { z } from 'zod';

/**
 * Schema for the status of a job.
 */
export const JobStatusSchema = z.enum(['preparing', 'running', 'success', 'failed']);

/**
 * Job status.
 */
export type JobStatus = z.infer<typeof JobStatusSchema>;

/**
 * Schema for the mode of a job.
 */
export const JobModeSchema = z.enum(['import', 'export']);

/**
 * Job mode.
 */
export type JobMode = z.infer<typeof JobModeSchema>;

/**
 * Schema for a task in the job.
 */
export const TaskSchema = z
  .object({
    /**
     * The ID of the task.
     */
    id: z.string(),

    /**
     * Are we importing or exporting?
     */
    mode: JobModeSchema,

    /**
     * The ID of the installed integration that processes the task.
     */
    integration: z.string(),

    /**
     * The task configuration.
     */
    config: z.unknown(),

    /**
     * The cloud file that's the input for the task.
     */
    inputFile: z.string(),

    /**
     * The cloud file that's the output for the task.
     */
    outputFile: z.string(),

    /**
     * The status of the task.
     */
    status: JobStatusSchema,

    /**
     * The error message if the task failed.
     */
    error: z.string().optional(),

    /**
     * The number of rows affected by the task.
     */
    rowsAffected: z.number(),

    /**
     * The date the task was created.
     */
    createdDate: z.coerce.date(),

    /**
     * The date the task finished.
     */
    finishedDate: z.coerce.date().nullable(),
  })
  .passthrough();

/**
 * A task in the job.
 */
export type Task = z.infer<typeof TaskSchema>;

/**
 * Schema for the details of a running job.
 */
export const JobSchema = z
  .object({
    /**
     * The ID of the job.
     */
    id: z.string(),

    /**
     * The job status.
     */
    status: JobStatusSchema,

    /**
     * Error message if the job failed.
     */
    error: z.string().optional(),

    /**
     * The tasks in the job.
     */
    tasks: z.array(TaskSchema),

    /**
     * The number of passes in the job.
     */
    passesCount: z.number(),

    /**
     * Log messages for the job.
     */
    logs: z.array(z.string()),

    /**
     * The date the job finished.
     */
    finishedDate: z.coerce.date().nullable(),

    /**
     * The date the job was created.
     */
    createdDate: z.coerce.date(),
  })
  .passthrough();

/**
 * The details of a running job.
 */
export type Job = z.infer<typeof JobSchema>;
