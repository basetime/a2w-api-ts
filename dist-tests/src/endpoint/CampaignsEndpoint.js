"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ClaimsEndpoint_1 = __importDefault(require("./campaigns/ClaimsEndpoint"));
const EnrollmentsEndpoint_1 = __importDefault(require("./campaigns/EnrollmentsEndpoint"));
const JobsEndpoint_1 = __importDefault(require("./campaigns/JobsEndpoint"));
const PassesEndpoint_1 = __importDefault(require("./campaigns/PassesEndpoint"));
const StatsEndpoint_1 = __importDefault(require("./campaigns/StatsEndpoint"));
const WalletsEndpoint_1 = __importDefault(require("./campaigns/WalletsEndpoint"));
const WorkflowsEndpoint_1 = __importDefault(require("./campaigns/WorkflowsEndpoint"));
const Endpoint_1 = __importDefault(require("./Endpoint"));
/**
 * Communicate with the campaigns endpoints.
 *
 * Top-level methods (`getAll`, `getById`) operate on the campaign collection itself. Per-campaign
 * sub-resources are grouped into dedicated sub-endpoints exposed as `public readonly` props,
 * mirroring the composition pattern of {@link ../Client | Client}.
 */
class CampaignsEndpoint extends Endpoint_1.default {
    /**
     * Constructor.
     *
     * @param req The object to use to make requests.
     */
    constructor(req) {
        super(req, '/campaigns');
        /**
         * Returns all of the campaigns for authenticated organization.
         *
         * @returns The campaigns.
         */
        this.getAll = async () => {
            return await this.do.get('');
        };
        /**
         * Returns the details of a campaign.
         *
         * @param id The ID of the campaign.
         */
        this.getById = async (id) => {
            return await this.do.get(`/${id}`);
        };
        /**
         * Updates a campaign.
         *
         * Mirrors the backend Joi schema permissively as `Partial<Campaign>`; only fields
         * accepted by the backend will be applied. `templates` is overridden to accept a list of
         * template IDs (the wire format used by the update route), not the populated
         * {@link Template} array returned by reads.
         *
         * @param id The ID of the campaign.
         * @param body The campaign updates.
         */
        this.update = async (id, body) => {
            return await this.do.post(`/${id}`, body);
        };
        /**
         * Creates or updates a "simple" campaign from a template and placeholder values.
         *
         * Pass `'__new'` as the ID to create a new campaign; pass an existing campaign ID to
         * update one in place.
         *
         * @param id The campaign ID, or `'__new'` to create a new campaign.
         * @param body The simple campaign body.
         */
        this.createSimple = async (id, body) => {
            return await this.do.post(`/${id}/simple`, body);
        };
        /**
         * Clones a campaign and returns the ID of the new campaign.
         *
         * @param id The ID of the campaign to clone.
         */
        this.clone = async (id) => {
            return await this.do.post(`/${id}/clone`, {});
        };
        /**
         * Deletes a campaign.
         *
         * @param id The ID of the campaign to delete.
         */
        this.delete = async (id) => {
            return await this.do.del(`/${id}`);
        };
        this.passes = new PassesEndpoint_1.default(req);
        this.claims = new ClaimsEndpoint_1.default(req);
        this.jobs = new JobsEndpoint_1.default(req);
        this.stats = new StatsEndpoint_1.default(req);
        this.enrollments = new EnrollmentsEndpoint_1.default(req);
        this.wallets = new WalletsEndpoint_1.default(req);
        this.workflows = new WorkflowsEndpoint_1.default(req);
    }
}
exports.default = CampaignsEndpoint;
