import { Schedule } from './Schedule';
import { Workflow } from './Workflow';

/**
 * Defines when a workflow attached to a campaign should run.
 *
 * Mirrors the `runsWhen` values accepted by the backend's
 * `validateCampaignWorkflow` schema.
 */
export type CampaignWorkflowRunsWhen =
  | 'enrolled'
  | 'claimed'
  | 'installed'
  | 'redeemed'
  | 'updated'
  | 'scanned'
  | 'scheduled';

/**
 * Body accepted by attach/update on the campaign workflows sub-endpoint.
 */
export interface CampaignWorkflowInput {
  /**
   * The ID of the workflow to attach.
   */
  workflowId: string;

  /**
   * When the workflow should run for the campaign.
   */
  runsWhen: CampaignWorkflowRunsWhen;

  /**
   * Optional schedule. Required when {@link runsWhen} is `scheduled`.
   */
  schedule?: Schedule | null;
}

/**
 * A workflow attachment on a campaign.
 *
 * Returned by `client.campaigns.workflows.getAll(...)`. When fetched via `getAll` the
 * `workflow` field is populated with the workflow entity itself.
 */
export interface CampaignWorkflow {
  /**
   * The ID of the campaign workflow attachment.
   */
  id: string;

  /**
   * The ID of the campaign the workflow is attached to.
   */
  campaignId: string;

  /**
   * The ID of the workflow that's attached.
   */
  workflowId: string;

  /**
   * When the workflow runs for this campaign.
   */
  runsWhen: CampaignWorkflowRunsWhen;

  /**
   * The schedule for the workflow, when {@link runsWhen} is `scheduled`.
   */
  schedule: Schedule | null;

  /**
   * The workflow entity, populated by `getAll(...)`.
   */
  workflow?: Workflow;
}
