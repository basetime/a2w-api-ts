"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Endpoint_1 = __importDefault(require("../Endpoint"));
/**
 * Communicate with the `/campaigns/:campaignId/jobs` sub-endpoint.
 *
 * Accessed via `client.campaigns.jobs`.
 */
class CampaignJobsEndpoint extends Endpoint_1.default {
    /**
     * Constructor.
     *
     * @param req The object to use to make requests.
     */
    constructor(req) {
        super(req, '/campaigns');
        /**
         * Returns the jobs for a campaign.
         *
         * @param campaignId The ID of the campaign.
         * @returns The jobs.
         */
        this.getAll = async (campaignId) => {
            return await this.do.get(`/${campaignId}/jobs`);
        };
    }
}
exports.default = CampaignJobsEndpoint;
