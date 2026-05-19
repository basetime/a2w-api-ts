"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignWalletEnrollmentResponseSchema = exports.CampaignWalletsResponseSchema = void 0;
const zod_1 = require("zod");
const Enrollment_1 = require("../../types/Enrollment");
const WalletUpdate_1 = require("../../types/WalletUpdate");
const Endpoint_1 = __importDefault(require("../Endpoint"));
/**
 * Schema for the response returned by {@link CampaignWalletsEndpoint.getAll}.
 *
 * Mirrors the backend's wallet listing response: a map of bundle IDs to request logs, the
 * corresponding bundles, and pagination metadata.
 */
exports.CampaignWalletsResponseSchema = zod_1.z
    .object({
    /**
     * Request logs grouped by bundle ID.
     */
    bundled: zod_1.z.record(zod_1.z.string(), zod_1.z.array(zod_1.z.unknown())),
    /**
     * The bundle entities referenced by {@link bundled}.
     */
    bundles: zod_1.z.array(zod_1.z.unknown()),
    /**
     * The current page number.
     */
    page: zod_1.z.number(),
    /**
     * The total number of items.
     */
    totalItems: zod_1.z.number(),
    /**
     * The total number of pages.
     */
    totalPages: zod_1.z.number(),
})
    .passthrough();
/**
 * Schema for the response returned by {@link CampaignWalletsEndpoint.getEnrollment}.
 */
exports.CampaignWalletEnrollmentResponseSchema = zod_1.z
    .object({
    /**
     * The campaign the enrollment belongs to.
     */
    campaign: zod_1.z.unknown(),
    /**
     * The enrollment details.
     */
    enrollment: Enrollment_1.EnrollmentSchema.nullable(),
})
    .passthrough();
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
     * @param parent The parent `CampaignsEndpoint` whose `req`, `do`, and `qb` are
     *   reused.
     */
    constructor(parent) {
        super(parent);
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
            return await this.do.get(url, exports.CampaignWalletsResponseSchema);
        };
        /**
         * Returns the details of a single wallet enrollment.
         *
         * @param campaignId The ID of the campaign.
         * @param enrollmentId The ID of the enrollment.
         */
        this.getEnrollment = async (campaignId, enrollmentId) => {
            return await this.do.get(`/${campaignId}/wallets/enrollments/${enrollmentId}`, exports.CampaignWalletEnrollmentResponseSchema);
        };
        /**
         * Returns the push log history for a specific pass.
         *
         * @param campaignId The ID of the campaign.
         * @param passId The ID of the pass.
         */
        this.getPushLogs = async (campaignId, passId) => {
            return await this.do.get(`/${campaignId}/wallets/pushes/${passId}/logs`, zod_1.z.array(WalletUpdate_1.WalletUpdateSchema));
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
            return await this.do.post(`/${campaignId}/wallets/pushes`, { templates: templateIds }, zod_1.z.number());
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
            return await this.do.del(`/${campaignId}/wallets/pushes`, zod_1.z.string());
        };
    }
}
exports.default = CampaignWalletsEndpoint;
