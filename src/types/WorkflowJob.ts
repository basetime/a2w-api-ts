import { z } from 'zod';

/**
 * Schema for the status of a workflow job.
 */
export const WorkflowJobStatusSchema = z.enum(['pending', 'running', 'success', 'error']);

/**
 * The status of a workflow job.
 */
export type WorkflowJobStatus = z.infer<typeof WorkflowJobStatusSchema>;

/**
 * Schema for a workflow job.
 */
export const WorkflowJobSchema = z
  .object({
    /**
     * The job ID.
     */
    id: z.string(),

    /**
     * The ID of the organization that owns the job.
     */
    organizationId: z.string(),

    /**
     * The ID of the workflow that owns the job when applicable.
     */
    workflowId: z.string().optional(),

    /**
     * The workflow code.
     */
    code: z.string(),

    /**
     * The workflow context.
     */
    context: z.unknown(),

    /**
     * The job status.
     */
    status: WorkflowJobStatusSchema,

    /**
     * The number of seconds the job ran for.
     */
    runTime: z.number(),

    /**
     * The last error that was thrown.
     */
    error: z.string().nullable(),

    /**
     * The date the job was created.
     */
    createdDate: z.coerce.date(),
  })
  .passthrough();

/**
 * Entity for the workflowJobs collection.
 */
export type WorkflowJob = z.infer<typeof WorkflowJobSchema>;
