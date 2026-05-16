"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Endpoint_1 = __importDefault(require("../Endpoint"));
/**
 * Communicate with the `/campaigns/:campaignId/wallets/*` sub-endpoints.
 *
 * Accessed via `client.campaigns.wallets`. Lists installed wallets, fetches per-pass push
 * logs, triggers template-driven pushes, and dismisses pending push notices.
 */
class CampaignWalletsEndpoint extends Endpoint_1.default {
    /**
     * Constructor.
     *
     * @param req The object to use to make requests.
     */
    constructor(req) {
        super(req, '/campaigns');
        /**
         * Returns the wallets for a campaign, grouped by bundle.
         *
         * @param campaignId The ID of the campaign.
         * @param pagination Optional pagination overrides.
         */
        this.getAll = async (campaignId, pagination = {}) => {
            const url = this.qb.create('/{campaign}/wallets').addParam('campaign', campaignId);
            if (pagination.page !== undefined) {
                url.addQuery('page', pagination.page);
            }
            if (pagination.perPage !== undefined) {
                url.addQuery('perPage', pagination.perPage);
            }
            return await this.do.get(url);
        };
        /**
         * Returns the details of a single wallet enrollment.
         *
         * @param campaignId The ID of the campaign.
         * @param enrollmentId The ID of the enrollment.
         */
        this.getEnrollment = async (campaignId, enrollmentId) => {
            return await this.do.get(`/${campaignId}/wallets/enrollments/${enrollmentId}`);
        };
        /**
         * Returns the push log history for a specific pass.
         *
         * @param campaignId The ID of the campaign.
         * @param passId The ID of the pass.
         */
        this.getPushLogs = async (campaignId, passId) => {
            return await this.do.get(`/${campaignId}/wallets/pushes/${passId}/logs`);
        };
        /**
         * Pushes template updates to every wallet that has the campaign's passes installed.
         *
         * Returns the number of passes that were queued for update.
         *
         * @param campaignId The ID of the campaign.
         * @param templateIds The IDs of the templates whose changes should be pushed.
         */
        this.pushTemplates = async (campaignId, templateIds) => {
            return await this.do.post(`/${campaignId}/wallets/pushes`, { templates: templateIds });
        };
        /**
         * Dismisses the "pending pushes" notice for a campaign without actually pushing.
         *
         * Advances each template's last-pushed version to the current version so the dashboard
         * stops nagging about unpushed changes.
         *
         * @param campaignId The ID of the campaign.
         */
        this.dismissPushes = async (campaignId) => {
            return await this.do.del(`/${campaignId}/wallets/pushes`);
        };
    }
}
exports.default = CampaignWalletsEndpoint;
