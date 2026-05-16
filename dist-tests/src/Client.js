"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpRequester_1 = __importDefault(require("./http/HttpRequester"));
const CampaignsEndpoint_1 = __importDefault(require("./endpoint/CampaignsEndpoint"));
const ClaimsEndpoint_1 = __importDefault(require("./endpoint/ClaimsEndpoint"));
const Images_1 = __importDefault(require("./endpoint/Images"));
const OrganizationsEndpoint_1 = __importDefault(require("./endpoint/OrganizationsEndpoint"));
const Scanners_1 = __importDefault(require("./endpoint/Scanners"));
const TemplatesEndpoint_1 = __importDefault(require("./endpoint/TemplatesEndpoint"));
const WorkflowsEndpoint_1 = __importDefault(require("./endpoint/WorkflowsEndpoint"));
/**
 * Client class that communicates with the the addtowallet API.
 *
 * The library's main entry point. Owns an `HttpRequester` (exposed as `http`) and constructs a
 * set of endpoint helpers — one per API resource — that share that same requester. Construct one
 * per credential set; the underlying `HttpRequester` is safe to reuse across many concurrent
 * requests.
 */
class Client {
    /**
     * Constructor.
     *
     * The auth provider is optional so an unauthenticated client can be used for public endpoints;
     * any subsequent calls that hit authenticated routes will fail until one is wired up via
     * `client.http.setAuth(...)`. When the logger is omitted, debug output is silently discarded.
     *
     * @param auth The authentication provider.
     * @param logger The logger to use.
     */
    constructor(auth, logger) {
        this.http = new HttpRequester_1.default(auth, logger);
        this.campaigns = new CampaignsEndpoint_1.default(this.http);
        this.claims = new ClaimsEndpoint_1.default(this.http);
        this.templates = new TemplatesEndpoint_1.default(this.http);
        this.organizations = new OrganizationsEndpoint_1.default(this.http);
        this.scanners = new Scanners_1.default(this.http);
        this.workflows = new WorkflowsEndpoint_1.default(this.http);
        this.images = new Images_1.default(this.http);
    }
}
exports.default = Client;
