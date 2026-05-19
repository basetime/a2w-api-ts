"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const CampaignWorkflow_1 = require("../../types/CampaignWorkflow");
const Endpoint_1 = __importDefault(require("../Endpoint"));
/**
 * Communicate with the `/campaigns/:campaignId/workflows` sub-endpoints.
 *
 * Accessed via `client.campaigns.workflows`. Methods take `campaignId` as their first
 * argument, matching the unbound style used elsewhere in the SDK.
 */
class CampaignWorkflowsEndpoint extends Endpoint_1.default {
    /**
     * Constructor.
     *
     * @param parent The parent `CampaignsEndpoint` whose `req`, `do`, and `qb` are
     *   reused.
     */
    constructor(parent) {
        super(parent);
        /**
         * Returns the workflows attached to a campaign.
         *
         * @param campaignId The ID of the campaign.
         */
        this.getAll = async (campaignId) => {
            return await this.do.get(`/${campaignId}/workflows`, zod_1.z.array(CampaignWorkflow_1.CampaignWorkflowSchema));
        };
        /**
         * Attaches a workflow to a campaign.
         *
         * @param campaignId The ID of the campaign.
         * @param body The attachment body (workflow ID + runsWhen + optional schedule).
         */
        this.attach = async (campaignId, body) => {
            return await this.do.post(`/${campaignId}/workflows`, body, CampaignWorkflow_1.CampaignWorkflowSchema);
        };
        /**
         * Updates an existing workflow attachment on a campaign.
         *
         * @param campaignId The ID of the campaign.
         * @param workflowId The ID of the campaign workflow attachment to update.
         * @param body The updated `runsWhen` and optional schedule.
         */
        this.update = async (campaignId, workflowId, body) => {
            return await this.do.post(`/${campaignId}/workflows/${workflowId}`, body, zod_1.z.string());
        };
        /**
         * Detaches a workflow from a campaign.
         *
         * Returns the remaining workflow attachments for the campaign.
         *
         * @param campaignId The ID of the campaign.
         * @param workflowId The ID of the campaign workflow attachment to detach.
         */
        this.detach = async (campaignId, workflowId) => {
            return await this.do.del(`/${campaignId}/workflows/${workflowId}`, zod_1.z.array(CampaignWorkflow_1.CampaignWorkflowSchema));
        };
    }
}
exports.default = CampaignWorkflowsEndpoint;
