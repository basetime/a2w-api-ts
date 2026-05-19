"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const Job_1 = require("../../types/Job");
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
     * @param parent The parent `CampaignsEndpoint` whose `req`, `do`, and `qb` are
     *   reused.
     */
    constructor(parent) {
        super(parent);
        /**
         * Returns the jobs for a campaign.
         *
         * @param campaignId The ID of the campaign.
         * @returns The jobs.
         */
        this.getAll = async (campaignId) => {
            return await this.do.get(`/${campaignId}/jobs`, zod_1.z.array(Job_1.JobSchema));
        };
    }
}
exports.default = CampaignJobsEndpoint;
