"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const Endpoint_1 = __importDefault(require("./Endpoint"));
/**
 * Communicate with the `/widgets` endpoint.
 *
 * Accessed via `client.widgets`. The widgets routes live outside `/api/v1`, so this
 * endpoint is constructed with `{ siteRoot: true }` — the inherited `this.do` builds
 * absolute URLs against the requester's current site base URL.
 */
class WidgetsEndpoint extends Endpoint_1.default {
    /**
     * Constructor.
     *
     * @param req The object to use to make requests.
     */
    constructor(req) {
        super(req, '/widgets', { siteRoot: true });
        /**
         * Signs an arbitrary payload as a JWT using a caller-supplied secret.
         *
         * Returns the signed JWT as a string. Sent unauthenticated because the secret is what
         * the backend uses to sign — the caller's API key is not involved.
         *
         * @param payload The payload to sign.
         * @param secret The HMAC secret used to sign the JWT.
         */
        this.signJwt = async (payload, secret) => {
            return await this.do.post('/jwt', { payload, secret }, zod_1.z.string(), false);
        };
        /**
         * Signs a campaign-scoped payload as a JWT.
         *
         * The backend signs with the campaign's `openEnrollmentJwtSecret`, so no client-side
         * secret is required.
         *
         * @param campaignId The ID of the campaign whose JWT secret should be used.
         * @param payload The payload to sign.
         */
        this.signCampaignJwt = async (campaignId, payload) => {
            const url = this.qb.create('/jwt/{campaign}').addParam('campaign', campaignId);
            return await this.do.post(url, { payload }, zod_1.z.string(), false);
        };
    }
}
exports.default = WidgetsEndpoint;
