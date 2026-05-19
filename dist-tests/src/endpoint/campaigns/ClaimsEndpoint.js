"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const Claim_1 = require("../../types/Claim");
const Endpoint_1 = __importDefault(require("../Endpoint"));
/**
 * Communicate with the `/campaigns/:campaignId/claims` sub-endpoint.
 *
 * Accessed via `client.campaigns.claims`. Distinct from the top-level
 * {@link ../ClaimsEndpoint | ClaimsEndpoint} which handles `/claim` (pkpass downloads).
 */
class CampaignClaimsEndpoint extends Endpoint_1.default {
    /**
     * Constructor.
     *
     * @param parent The parent `CampaignsEndpoint` whose `req`, `do`, and `qb` are
     *   reused.
     */
    constructor(parent) {
        super(parent);
        /**
         * Returns the claims for a campaign.
         *
         * @param campaignId The ID of the campaign.
         * @returns The claims.
         */
        this.getAll = async (campaignId) => {
            return await this.do.get(`/${campaignId}/claims`, zod_1.z.array(Claim_1.ClaimSchema));
        };
    }
}
exports.default = CampaignClaimsEndpoint;
