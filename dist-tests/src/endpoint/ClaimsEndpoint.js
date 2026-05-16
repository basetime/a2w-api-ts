"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Endpoint_1 = __importDefault(require("./Endpoint"));
/**
 * The claims endpoint.
 */
const endpoint = '/claim';
/**
 * Communicate with the claims endpoints.
 */
class ClaimsEndpoint extends Endpoint_1.default {
    /**
     * Constructor.
     *
     * @param req The object to use to make requests.
     */
    constructor(req) {
        super(req, endpoint);
        /**
         * Returns the pkpass file for a campaign and pass.
         *
         * @param campaignId The ID of the campaign.
         * @param passId The ID of the pass.
         * @returns The pkpass file.
         */
        this.getPkpass = async (campaignId, passId) => {
            const url = this.qb.create('/{campaign}/{pass}.pkpass')
                .addParam('campaign', campaignId)
                .addParam('pass', passId);
            return await this.doFetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/vnd.apple.pkpass',
                },
            });
        };
    }
}
exports.default = ClaimsEndpoint;
