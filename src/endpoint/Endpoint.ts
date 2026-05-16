import { QueryBuilder } from '../http/QueryBuilder';
import { Requester } from '../http/Requester';
import EndpointDo from './EndpointDo';

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
export default abstract class Endpoint {
  /**
   * Verb wrapper bound to this endpoint's path. Subclasses call `this.do.get('/foo')`,
   * etc.; the wrapper handles prefixing and delegation to the requester.
   */
  protected do: EndpointDo;

  /**
   * Fluent URL builder rooted at this endpoint's path. Produces relative URLs
   * (e.g. `/campaigns/abc/passes?sort=desc`); the configured API base URL is prepended
   * later by `HttpRequester.fetch()`.
   */
  protected qb: QueryBuilder;

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
  constructor(protected req: Requester, endpointPath: string) {
    this.do = new EndpointDo(req, endpointPath);
    this.qb = new QueryBuilder('', endpointPath);
  }
}
