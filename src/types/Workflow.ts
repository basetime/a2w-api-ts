import { z } from 'zod';

/**
 * Schema for a workflow.
 */
export const WorkflowSchema = z
  .object({
    /**
     * The workflow ID.
     */
    id: z.string(),

    /**
     * The ID of the organization that owns the workflow.
     */
    organizationId: z.string(),

    /**
     * The scanner app associated with the workflow.
     */
    scannerAppId: z.string().nullable(),

    /**
     * The name of the workflow.
     */
    name: z.string(),

    /**
     * The description of the workflow.
     */
    description: z.string(),

    /**
     * The code to run.
     */
    code: z.string(),

    /**
     * The packages to install.
     *
     * This is a list of NPM package names in the form of `package-name@version`.
     */
    packages: z.array(z.string()),

    /**
     * The date the workflow was created.
     */
    createdDate: z.coerce.date(),
  })
  .passthrough();

/**
 * Entity for the workflows collection.
 */
export type Workflow = z.infer<typeof WorkflowSchema>;
