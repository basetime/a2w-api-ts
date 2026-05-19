"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const QueryBuilder_1 = require("../http/QueryBuilder");
const EndpointDo_1 = __importDefault(require("./EndpointDo"));
/**
 * Parent class for other endpoints.
 *
 * Exposes two pre-bound helpers rooted at the subclass's endpoint path:
 *
 * - `this.do` — verb wrapper (`get`/`post`/`put`/`del`/`fetch`) that prepends the endpoint
 *   path to any string URL it receives, so subclasses pass *relative* paths.
 * - `this.qb` — fluent URL builder (`{name}` placeholders + `?key=val` queries) that
 *   produces URLs already including the endpoint prefix.
 *
 * There are two ways to construct an endpoint:
 *
 * 1. `super(req, '/path', opts?)` — for top-level endpoints (`CampaignsEndpoint`,
 *    `WorkflowsEndpoint`, ...). Allocates a fresh `EndpointDo`/`QueryBuilder` pair
 *    rooted at the supplied path.
 * 2. `super(parent)` — for sub-endpoints that share their parent's path prefix
 *    (e.g. `CampaignPassesEndpoint` shares `/campaigns` with its parent
 *    `CampaignsEndpoint`). Reuses the parent's helpers and the parent's `req`.
 */
class Endpoint {
    /**
     * Constructor.
     *
     * Accepts either a {@link Requester} + path (for top-level endpoints) or a parent
     * {@link Endpoint} (for sub-endpoints that share their parent's path prefix).
     *
     * @param reqOrParent The requester (top-level) or parent endpoint (sub-endpoint).
     * @param endpointPath The path prefix shared by `this.do` and `this.qb`,
     *   e.g. `/campaigns`. Required when `reqOrParent` is a `Requester`.
     * @param options Additional options (currently just `siteRoot`).
     */
    constructor(reqOrParent, endpointPath, options) {
        if (reqOrParent instanceof Endpoint) {
            this.req = reqOrParent.req;
            this.do = reqOrParent.do;
            this.qb = reqOrParent.qb;
            return;
        }
        if (endpointPath === undefined) {
            throw new Error('Endpoint: endpointPath is required when constructing from a Requester');
        }
        const siteRoot = options?.siteRoot ?? false;
        this.req = reqOrParent;
        const resolvePrefix = siteRoot
            ? () => reqOrParent.getSiteBaseUrl()
            : undefined;
        this.do = new EndpointDo_1.default(reqOrParent, endpointPath, resolvePrefix);
        this.qb = new QueryBuilder_1.QueryBuilder('', endpointPath, resolvePrefix);
    }
}
exports.default = Endpoint;
