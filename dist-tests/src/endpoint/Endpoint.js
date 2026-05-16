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
 * Both share the path passed to `super(req, endpointPath)`, so a subclass only ever
 * spells its prefix once.
 */
class Endpoint {
    /**
     * Constructor.
     *
     * The requester is typically the shared `HttpRequester` owned by the parent `Client`,
     * but tests may pass any object that satisfies the `Requester` interface.
     *
     * @param req The object to use to make requests.
     * @param endpointPath The path prefix shared by `this.do` and `this.qb`,
     *   e.g. `/campaigns`.
     */
    constructor(req, endpointPath) {
        this.req = req;
        this.do = new EndpointDo_1.default(req, endpointPath);
        this.qb = new QueryBuilder_1.QueryBuilder('', endpointPath);
    }
}
exports.default = Endpoint;
