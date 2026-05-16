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
    constructor() {
        super(...arguments);
        /**
         * Returns the pkpass file for a campaign and pass.
         *
         * @param campaignId The ID of the campaign.
         * @param passId The ID of the pass.
         * @returns The pkpass file.
         */
        this.getPkpass = async (campaignId, passId) => {
            const url = `${endpoint}/${campaignId}/${passId}.pkpass`;
            return await this.req.fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/vnd.apple.pkpass',
                },
            });
        };
    }
}
exports.default = ClaimsEndpoint;
