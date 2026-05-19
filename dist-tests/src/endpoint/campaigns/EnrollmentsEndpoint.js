"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const Enrollment_1 = require("../../types/Enrollment");
const Endpoint_1 = __importDefault(require("../Endpoint"));
const EndpointDo_1 = __importDefault(require("../EndpointDo"));
/**
 * Communicate with the enrollment endpoints.
 *
 * Accessed via `client.campaigns.enrollments`. Reads live under `/campaigns/:id/enrollments`
 * (handled via the inherited `this.do`); writes hit the unauthenticated `/e/campaign/:id`
 * route via a dedicated {@link EndpointDo} instance.
 */
class CampaignEnrollmentsEndpoint extends Endpoint_1.default {
    /**
     * Constructor.
     *
     * @param parent The parent `CampaignsEndpoint` whose `req`, `do`, and `qb` are
     *   reused. The extra `/e` enrollment endpoint is constructed against the parent's
     *   requester.
     */
    constructor(parent) {
        super(parent);
        /**
         * Returns the enrollments for a campaign.
         *
         * @param campaignId The ID of the campaign.
         * @returns The enrollments.
         */
        this.getAll = async (campaignId) => {
            return await this.do.get(`/${campaignId}/enrollments`, zod_1.z.array(Enrollment_1.EnrollmentSchema));
        };
        /**
         * Creates an enrollment for a campaign, and returns the bundle ID and any errors.
         *
         * This method needs to encode the data into a jwt. The jwt is used to authenticate
         * with the site. This method requires {@link jwtEncode} to be set.
         *
         * @param campaignId The ID of the campaign.
         * @param metaValues The meta values to set.
         * @param formValues The form values to set.
         */
        this.create = async (campaignId, metaValues = {}, formValues = {}) => {
            if (!this.jwtEncode) {
                throw new Error('CampaignEnrollmentsEndpoint.create() requires the jwtEncode function to be set.');
            }
            const body = {
                d: await this.jwtEncode({ metaValues, formValues }),
            };
            return await this.enrollment.post(`/campaign/${campaignId}`, body, Enrollment_1.EnrollmentResponseSchema);
        };
        this.enrollment = new EndpointDo_1.default(this.req, '/e');
    }
}
exports.default = CampaignEnrollmentsEndpoint;
