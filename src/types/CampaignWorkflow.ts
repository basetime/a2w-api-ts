import { z } from 'zod';
import { ScheduleSchema } from './Schedule';
import { WorkflowSchema } from './Workflow';

/**
 * Schema for when a workflow attached to a campaign should run.
 *
 * Mirrors the `runsWhen` values accepted by the backend's
 * `validateCampaignWorkflow` schema.
 */
export const CampaignWorkflowRunsWhenSchema = z.enum([
  'enrolled',
  'claimed',
  'installed',
  'redeemed',
  'updated',
  'scanned',
  'scheduled',
]);

/**
 * Defines when a workflow attached to a campaign should run.
 */
export type CampaignWorkflowRunsWhen = z.infer<typeof CampaignWorkflowRunsWhenSchema>;

/**
 * Schema for the body accepted by attach/update on the campaign workflows sub-endpoint.
 */
export const CampaignWorkflowInputSchema = z
  .object({
    /**
     * The ID of the workflow to attach.
     */
    workflowId: z.string(),

    /**
     * When the workflow should run for the campaign.
     */
    runsWhen: CampaignWorkflowRunsWhenSchema,

    /**
     * Optional schedule. Required when {@link runsWhen} is `scheduled`.
     */
    schedule: ScheduleSchema.nullable().optional(),
  })
  .passthrough();

/**
 * Body accepted by attach/update on the campaign workflows sub-endpoint.
 */
export type CampaignWorkflowInput = z.infer<typeof CampaignWorkflowInputSchema>;

/**
 * Schema for a workflow attachment on a campaign.
 *
 * Returned by `client.campaigns.workflows.getAll(...)`. When fetched via `getAll` the
 * `workflow` field is populated with the workflow entity itself.
 */
export const CampaignWorkflowSchema = z
  .object({
    /**
     * The ID of the campaign workflow attachment.
     */
    id: z.string(),

    /**
     * The ID of the campaign the workflow is attached to.
     */
    campaignId: z.string(),

    /**
     * The ID of the workflow that's attached.
     */
    workflowId: z.string(),

    /**
     * When the workflow runs for this campaign.
     */
    runsWhen: CampaignWorkflowRunsWhenSchema,

    /**
     * The schedule for the workflow, when {@link runsWhen} is `scheduled`.
     */
    schedule: ScheduleSchema.nullable(),

    /**
     * The workflow entity, populated by `getAll(...)`.
     */
    workflow: WorkflowSchema.optional(),
  })
  .passthrough();

/**
 * A workflow attachment on a campaign.
 */
export type CampaignWorkflow = z.infer<typeof CampaignWorkflowSchema>;
