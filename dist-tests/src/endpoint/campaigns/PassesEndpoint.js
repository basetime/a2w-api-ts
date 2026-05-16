"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Endpoint_1 = __importDefault(require("../Endpoint"));
/**
 * Communicate with the `/campaigns/:campaignId/passes/*` sub-endpoints.
 *
 * Accessed via `client.campaigns.passes`. Methods take `campaignId` as their first argument,
 * matching the unbound style used elsewhere in the SDK.
 */
class CampaignPassesEndpoint extends Endpoint_1.default {
    /**
     * Constructor.
     *
     * @param req The object to use to make requests.
     */
    constructor(req) {
        super(req, '/campaigns');
        /**
         * Returns the passes for a campaign.
         *
         * @param campaignId The ID of the campaign.
         * @returns The passes.
         */
        this.getAll = async (campaignId) => {
            return await this.do.get(`/${campaignId}/passes`);
        };
        /**
         * Returns the details for a pass.
         *
         * @param campaignId The campaign the pass belongs to.
         * @param passId The ID of the pass.
         * @param scanner Only used by scanners. The scanner that's being used to request the pass.
         */
        this.getById = async (campaignId, passId, scanner = '') => {
            const url = this.qb.create('/{campaign}/passes/details/{pass}')
                .addParam('campaign', campaignId)
                .addParam('pass', passId)
                .addQuery('scanner', JSON.stringify(scanner));
            return await this.do.get(url);
        };
        /**
         * Queries the passes for a campaign.
         *
         * @param campaignId The ID of the campaign.
         * @param queries The queries to run.
         * @returns The passes.
         */
        this.query = async (campaignId, queries = {}) => {
            const url = this.qb.create('/{campaign}/passes/query').addParam('campaign', campaignId);
            Object.entries(queries).forEach(([key, value]) => url.addQuery('query[]', `${key}:${value}`));
            return await this.do.get(url);
        };
        /**
         * Updates the details of a pass.
         *
         * This method also updates the wallets that contain the pass.
         *
         * @param campaignId The ID of the campaign the pass belongs to.
         * @param passId The ID of the pass.
         * @param body The new pass values.
         */
        this.update = async (campaignId, passId, body) => {
            const cleaned = {
                objectStore: body.objectStore,
                templateId: body.templateId,
                templateVersion: body.templateVersion,
                passTypeIdentifier: body.passTypeIdentifier,
            };
            return await this.do.post(`/${campaignId}/passes/details/${passId}`, cleaned);
        };
        /**
         * Merges a pass object store into the existing object store.
         *
         * @param campaignId The ID of the campaign the pass belongs to.
         * @param passId The ID of the pass to merge.
         * @param body The new pass values with objectStore key.
         */
        this.mergeObjectStore = async (campaignId, passId, body) => {
            return await this.do.put(`/${campaignId}/passes/details/${passId}`, {
                objectStore: body.objectStore,
            });
        };
        /**
         * Deletes keys from a pass object store.
         *
         * @param campaignId The ID of the campaign the pass belongs to.
         * @param passId The ID of the pass to delete the keys from.
         * @param objectStoreKeys The keys to delete from the object store.
         */
        this.deleteObjectStoreKeys = async (campaignId, passId, objectStoreKeys) => {
            return await this.do.del(`/${campaignId}/passes/details/${passId}`, true, { objectStoreKeys });
        };
        /**
         * Updates multiple passes.
         *
         * @param campaignId The ID of the campaign the passes belong to.
         * @param passes The passes to update.
         */
        this.updateMany = async (campaignId, passes) => {
            // Filter out the values that can't be updated via this endpoint.
            const cleaned = passes.map((pass) => {
                return {
                    id: pass.id,
                    objectStore: pass.objectStore,
                    templateId: pass.templateId,
                    templateVersion: pass.templateVersion,
                    passTypeIdentifier: pass.passTypeIdentifier,
                };
            });
            return await this.do.post(`/${campaignId}/passes/details/passes`, { passes: cleaned });
        };
        /**
         * Appends a log to a pass.
         *
         * @param campaignId The ID of the campaign the pass belongs to.
         * @param passId The ID of the pass.
         * @param log The message to append to the log.
         */
        this.appendLog = async (campaignId, passId, log) => {
            return await this.do.post(`/${campaignId}/passes/${passId}/logs`, { log });
        };
        /**
         * Creates a pass bundle and returns the URL to the claims page.
         *
         * Example:
         * ```ts
         * const client = new Client(auth, console);
         * const link = await client.campaigns.passes.createBundle('123');
         * console.log(link);
         * ```
         *
         * @param campaignId The campaign the pass belongs to.
         * @param metaValues The meta values to set.
         * @param objectStore The object store to set.
         * @param utm The UTM values to pass along to the api.
         */
        this.createBundle = async (campaignId, metaValues = {}, objectStore = {}, utm = {}) => {
            return await this.do.post(`/${campaignId}/passes/bundle`, {
                metaValues,
                objectStore,
                utm,
            });
        };
        /**
         * Returns the passes for a job.
         *
         * @param campaignId The ID of the campaign.
         * @param jobId The ID of the job.
         * @returns The passes.
         */
        this.getByJob = async (campaignId, jobId) => {
            return await this.do.get(`/${campaignId}/passes/${jobId}`);
        };
        /**
         * Sets the redeemed status of a pass to true.
         *
         * @param campaignId The ID of the campaign.
         * @param passId The ID of the pass.
         * @returns True if the pass was redeemed, false if it was already redeemed.
         */
        this.redeem = async (campaignId, passId) => {
            return await this.do.post(`/${campaignId}/passes/${passId}/redeemed`, {});
        };
        /**
         * Returns the redeemed status of a pass.
         *
         * @param campaignId The ID of the campaign.
         * @param passId The ID of the pass.
         * @returns The redeemed status.
         */
        this.getRedeemedStatus = async (campaignId, passId) => {
            return await this.do.get(`/${campaignId}/passes/${passId}/redeemed`);
        };
    }
}
exports.default = CampaignPassesEndpoint;
