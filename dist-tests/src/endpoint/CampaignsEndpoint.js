"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Endpoint_1 = __importDefault(require("./Endpoint"));
/**
 * The campaigns endpoint.
 */
const endpoint = '/campaigns';
/**
 * The enrollment endpoint.
 */
const enrollmentEndpoint = '/e';
/**
 * Communicate with the campaigns endpoints.
 */
class CampaignsEndpoint extends Endpoint_1.default {
    constructor() {
        super(...arguments);
        /**
         * Returns all of the campaigns for authenticated organization.
         *
         * @returns The campaigns.
         */
        this.getAll = async () => {
            return await this.doGet(endpoint);
        };
        /**
         * Returns the details of a campaign.
         *
         * @param id The ID of the campaign.
         */
        this.getById = async (id) => {
            return await this.doGet(`${endpoint}/${id}`);
        };
        /**
         * Returns the passes for a campaign.
         *
         * @param campaignId The ID of the campaign.
         * @returns The passes.
         */
        this.getPasses = async (campaignId) => {
            return await this.doGet(`${endpoint}/${campaignId}/passes`);
        };
        /**
         * Returns the details for a pass.
         *
         * @param campaignId The campaign the pass belongs to.
         * @param passId The ID of the pass.
         * @param scanner Only used by scanners. The scanner that's being used to request the pass.
         */
        this.getPass = async (campaignId, passId, scanner = '') => {
            const scannerStr = encodeURIComponent(JSON.stringify(scanner));
            const url = `${endpoint}/${campaignId}/passes/details/${passId}?scanner=${scannerStr}`;
            return await this.doGet(url);
        };
        /**
         * Queries the passes for a campaign.
         *
         * @param campaignId The ID of the campaign.
         * @param queries The queries to run.
         * @returns The passes.
         */
        this.queryPasses = async (campaignId, queries = {}) => {
            let url = `${endpoint}/${campaignId}/passes/query`;
            if (Object.keys(queries).length > 0) {
                const e = encodeURIComponent;
                const queryString = Object.entries(queries).map(([key, value]) => `query[]=${e(key)}:${e(value)}`).join('&');
                url = `${url}?${queryString}`;
            }
            return await this.doGet(url);
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
        this.updatePass = async (campaignId, passId, body) => {
            const url = `${endpoint}/${campaignId}/passes/details/${passId}`;
            const cleaned = {
                objectStore: body.objectStore,
                templateId: body.templateId,
                templateVersion: body.templateVersion,
                passTypeIdentifier: body.passTypeIdentifier,
            };
            return await this.doPost(url, cleaned);
        };
        /**
         * Merges a pass object store into the existing object store.
         *
         * @param campaignId The ID of the campaign the pass belongs to.
         * @param passId The ID of the pass to merge.
         * @param body The new pass values with objectStore key.
         */
        this.mergeObjectStore = async (campaignId, passId, body) => {
            const url = `${endpoint}/${campaignId}/passes/details/${passId}`;
            return await this.doPut(url, {
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
            const url = `${endpoint}/${campaignId}/passes/details/${passId}`;
            return await this.doDelete(url, true, { objectStoreKeys });
        };
        /**
         * Updates multiple passes.
         *
         * @param campaignId The ID of the campaign the passes belong to.
         * @param bodies The passes to update.
         */
        this.updatePasses = async (campaignId, passes) => {
            const url = `${endpoint}/${campaignId}/passes/details/passes`;
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
            return await this.doPost(url, { passes: cleaned });
        };
        /**
         * Appends a log to a pass.
         *
         * @param campaignId The ID of the campaign the pass belongs to.
         * @param passId The ID of the pass.
         * @param log The message to append to the log.
         */
        this.appendLog = async (campaignId, passId, log) => {
            const url = `${endpoint}/${campaignId}/passes/${passId}/logs`;
            return await this.doPost(url, { log });
        };
        /**
         * Creates a pass bundle and returns the URL to the claims page.
         *
         * Example:
         * ```ts
         * const client = new Client(auth, console);
         * const link = await client.campaigns.createBundle('123');
         * console.log(link);
         * ```
         *
         * @param campaignId The campaign the pass belongs to.
         * @param metaValues The meta values to set.
         * @param objectStore The object store to set.
         * @param utm The UTM values to pass along to the api.
         */
        this.createBundle = async (campaignId, metaValues = {}, objectStore = {}, utm = {}) => {
            const url = `${endpoint}/${campaignId}/passes/bundle`;
            return await this.doPost(url, {
                metaValues,
                objectStore,
                utm,
            });
        };
        /**
         * Creates an enrollment for a campaign, and returns the bundle ID and any errors.
         *
         * This method needs to encode the data into a jwt. The jwt is used to authenticate
         * with the site. This method requires the jwtEncode function to be set.
         *
         * @param campaignId The ID of the campaign.
         * @param metaValues The meta values to set.
         * @param formValues The form values to set.
         */
        this.createEnrollment = async (campaignId, metaValues = {}, formValues = {}) => {
            if (!this.jwtEncode) {
                throw new Error('CampaignsEndpoint.createEnrollment() requires the jwtEncode function to be set.');
            }
            const body = {
                d: await this.jwtEncode({
                    metaValues,
                    formValues,
                }),
            };
            const url = `${enrollmentEndpoint}/campaign/${campaignId}`;
            return await this.doPost(url, body);
        };
        /**
         * Returns the passes for a job.
         *
         * @param campaignId The ID of the campaign.
         * @param jobId The ID of the job.
         * @returns The passes.
         */
        this.getPassesByJob = async (campaignId, jobId) => {
            return await this.doGet(`${endpoint}/${campaignId}/passes/${jobId}`);
        };
        /**
         * Returns the claims for a campaign.
         *
         * @param campaignId The ID of the campaign.
         * @returns The claims.
         */
        this.getClaims = async (campaignId) => {
            return await this.doGet(`${endpoint}/${campaignId}/claims`);
        };
        /**
         * Returns the jobs for a campaign.
         *
         * @param campaignId The ID of the campaign.
         * @returns The jobs.
         */
        this.getJobs = async (campaignId) => {
            return await this.doGet(`${endpoint}/${campaignId}/jobs`);
        };
        /**
         * Returns statistics for a campaign.
         *
         * @param campaignId The ID of the campaign.
         * @returns The statistics.
         */
        this.getStats = async (campaignId) => {
            return await this.doGet(`${endpoint}/${campaignId}/stats`);
        };
        /**
         * Returns the enrollments for a campaign.
         *
         * @param campaignId The ID of the campaign.
         * @returns The enrollments.
         */
        this.getEnrollments = async (campaignId) => {
            return await this.doGet(`${endpoint}/${campaignId}/enrollments`);
        };
        /**
         * Sets the redeemed status of a pass to true.
         *
         * @param campaignId The ID of the campaign.
         * @param passId The ID of the pass.
         * @returns True if the pass was redeemed, false if it was already redeemed.
         */
        this.redeemPass = async (campaignId, passId) => {
            const url = `${endpoint}/${campaignId}/passes/${passId}/redeemed`;
            return await this.doPost(url, {});
        };
        /**
         * Returns the redeemed status of a pass.
         *
         * @param campaignId The ID of the campaign.
         * @param passId The ID of the pass.
         * @returns The redeemed status.
         */
        this.getRedeemedStatus = async (campaignId, passId) => {
            const url = `${endpoint}/${campaignId}/passes/${passId}/redeemed`;
            return await this.doGet(url);
        };
    }
}
exports.default = CampaignsEndpoint;
