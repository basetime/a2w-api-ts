import { z } from 'zod';

/**
 * Schema for a message logged during a workflow run.
 */
export const WorkflowMessageSchema = z
  .object({
    /**
     * The type of message.
     */
    type: z.enum(['info', 'error', 'warn', 'marker-start', 'marker-end']),

    /**
     * The message to display.
     */
    message: z.string(),
  })
  .passthrough();

/**
 * Represents a message to display in the workflow.
 */
export type WorkflowMessage = z.infer<typeof WorkflowMessageSchema>;
