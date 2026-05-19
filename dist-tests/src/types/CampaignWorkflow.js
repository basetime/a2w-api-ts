"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignWorkflowSchema = exports.CampaignWorkflowInputSchema = exports.CampaignWorkflowRunsWhenSchema = void 0;
const zod_1 = require("zod");
const Schedule_1 = require("./Schedule");
const Workflow_1 = require("./Workflow");
/**
 * Schema for when a workflow attached to a campaign should run.
 *
 * Mirrors the `runsWhen` values accepted by the backend's
 * `validateCampaignWorkflow` schema.
 */
exports.CampaignWorkflowRunsWhenSchema = zod_1.z.enum([
    'enrolled',
    'claimed',
    'installed',
    'redeemed',
    'updated',
    'scanned',
    'scheduled',
]);
/**
 * Schema for the body accepted by attach/update on the campaign workflows sub-endpoint.
 */
exports.CampaignWorkflowInputSchema = zod_1.z
    .object({
    /**
     * The ID of the workflow to attach.
     */
    workflowId: zod_1.z.string(),
    /**
     * When the workflow should run for the campaign.
     */
    runsWhen: exports.CampaignWorkflowRunsWhenSchema,
    /**
     * Optional schedule. Required when {@link runsWhen} is `scheduled`.
     */
    schedule: Schedule_1.ScheduleSchema.nullable().optional(),
})
    .passthrough();
/**
 * Schema for a workflow attachment on a campaign.
 *
 * Returned by `client.campaigns.workflows.getAll(...)`. When fetched via `getAll` the
 * `workflow` field is populated with the workflow entity itself.
 */
exports.CampaignWorkflowSchema = zod_1.z
    .object({
    /**
     * The ID of the campaign workflow attachment.
     */
    id: zod_1.z.string(),
    /**
     * The ID of the campaign the workflow is attached to.
     */
    campaignId: zod_1.z.string(),
    /**
     * The ID of the workflow that's attached.
     */
    workflowId: zod_1.z.string(),
    /**
     * When the workflow runs for this campaign.
     */
    runsWhen: exports.CampaignWorkflowRunsWhenSchema,
    /**
     * The schedule for the workflow, when {@link runsWhen} is `scheduled`.
     */
    schedule: Schedule_1.ScheduleSchema.nullable(),
    /**
     * The workflow entity, populated by `getAll(...)`.
     */
    workflow: Workflow_1.WorkflowSchema.optional(),
})
    .passthrough();
