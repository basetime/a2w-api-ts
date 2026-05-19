"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CampaignStats_1 = require("../../types/CampaignStats");
const Endpoint_1 = __importDefault(require("../Endpoint"));
/**
 * Communicate with the `/campaigns/:campaignId/stats` sub-endpoint.
 *
 * Accessed via `client.campaigns.stats`.
 */
class CampaignStatsEndpoint extends Endpoint_1.default {
    /**
     * Constructor.
     *
     * @param parent The parent `CampaignsEndpoint` whose `req`, `do`, and `qb` are
     *   reused.
     */
    constructor(parent) {
        super(parent);
        /**
         * Returns statistics for a campaign.
         *
         * @param campaignId The ID of the campaign.
         * @returns The statistics.
         */
        this.get = async (campaignId) => {
            return await this.do.get(`/${campaignId}/stats`, CampaignStats_1.CampaignStatsSchema);
        };
    }
}
exports.default = CampaignStatsEndpoint;
