import { PrefixResolver, QueryBuilder } from '../http/QueryBuilder';
import { Requester } from '../http/Requester';
import EndpointDo from './EndpointDo';

/**
 * Options accepted by the {@link Endpoint} constructor.
 */
export interface EndpointOptions {
  /**
   * When true, the endpoint's URLs are rooted at the requester's *site* base URL (the
   * API base URL with a trailing `/api/v1` stripped) rather than the API base URL
   * itself. Used by endpoints that target routes mounted at the site root
   * (e.g. `/barcodes`, `/widgets`).
   */
  siteRoot?: boolean;
}

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
export default abstract class Endpoint {
  /**
   * The object used to make requests. Same instance as the parent's when the subclass
   * was constructed via `super(parent)`.
   */
  protected req: Requester;

  /**
   * Verb wrapper bound to this endpoint's path. Subclasses call `this.do.get('/foo')`,
   * etc.; the wrapper handles prefixing and delegation to the requester.
   */
  protected do: EndpointDo;

  /**
   * Fluent URL builder rooted at this endpoint's path. Produces relative URLs
   * (e.g. `/campaigns/abc/passes?sort=desc`) for API-rooted endpoints, or absolute
   * URLs starting with the requester's site base URL for `siteRoot` endpoints.
   */
  protected qb: QueryBuilder;

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
  constructor(reqOrParent: Requester | Endpoint, endpointPath?: string, options?: EndpointOptions) {
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
    const resolvePrefix: PrefixResolver | undefined = siteRoot
      ? () => reqOrParent.getSiteBaseUrl()
      : undefined;
    this.do = new EndpointDo(reqOrParent, endpointPath, resolvePrefix);
    this.qb = new QueryBuilder('', endpointPath, resolvePrefix);
  }
}
