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
        this.passes = new PassesEndpoint_1.default(req);
        this.claims = new ClaimsEndpoint_1.default(req);
        this.jobs = new JobsEndpoint_1.default(req);
        this.stats = new StatsEndpoint_1.default(req);
        this.enrollments = new EnrollmentsEndpoint_1.default(req);
    }
}
exports.default = CampaignsEndpoint;
