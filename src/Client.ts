import HttpRequester from './http/HttpRequester';
import { Logger } from './Logger';
import CampaignsEndpoint from './endpoint/CampaignsEndpoint';
import ClaimsEndpoint from './endpoint/ClaimsEndpoint';
import ImagesEndpoint from './endpoint/Images';
import OrganizationsEndpoint from './endpoint/OrganizationsEndpoint';
import ScannersEndpoint from './endpoint/Scanners';
import TemplatesEndpoint from './endpoint/TemplatesEndpoint';
import WorkflowsEndpoint from './endpoint/WorkflowsEndpoint';
import { AuthProvider } from './provider/AuthProvider';

/**
 * Client class that communicates with the the addtowallet API.
 *
 * The library's main entry point. Owns an `HttpRequester` (exposed as `http`) and constructs a
 * set of endpoint helpers — one per API resource — that share that same requester. Construct one
 * per credential set; the underlying `HttpRequester` is safe to reuse across many concurrent
 * requests.
 */
export default class Client {
  /**
   * The HTTP client used for all requests to the API.
   *
   * Exposed publicly so callers can issue ad-hoc `fetch`/`doGet`/etc. requests against endpoints
   * that don't yet have a dedicated helper. All bundled endpoints share this same instance, so
   * configuration changes (base URL, auth, user agent) apply uniformly.
   */
  public readonly http: HttpRequester;

  /**
   * The campaigns endpoint.
   *
   * CRUD operations, stats, and enrollment helpers for campaigns owned by the authenticated
   * organization.
   */
  public readonly campaigns: CampaignsEndpoint;

  /**
   * The claims endpoint.
   *
   * Manages pass claims — fetching, claiming, and inspecting claim state.
   */
  public readonly claims: ClaimsEndpoint;

  /**
   * The templates endpoint.
   *
   * Reads and writes pass templates (Apple Wallet and Google Wallet) and their thumbnails.
   */
  public readonly templates: TemplatesEndpoint;

  /**
   * The organizations endpoint.
   *
   * Manages the authenticated organization, its members, API keys, and related settings.
   */
  public readonly organizations: OrganizationsEndpoint;

  /**
   * The scanners endpoint.
   *
   * Manages scanner apps, invites, and per-device state used by the Addtowallet scanner
   * companion.
   */
  public readonly scanners: ScannersEndpoint;

  /**
   * The workflows endpoint.
   *
   * Drives automated workflows — triggers, jobs, and messages associated with them.
   */
  public readonly workflows: WorkflowsEndpoint;

  /**
   * The images endpoint.
   *
   * Uploads, lists, and deletes images stored against the authenticated organization.
   */
  public readonly images: ImagesEndpoint;

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
  constructor(auth?: AuthProvider, logger?: Logger) {
    this.http = new HttpRequester(auth, logger);
    this.campaigns = new CampaignsEndpoint(this.http);
    this.claims = new ClaimsEndpoint(this.http);
    this.templates = new TemplatesEndpoint(this.http);
    this.organizations = new OrganizationsEndpoint(this.http);
    this.scanners = new ScannersEndpoint(this.http);
    this.workflows = new WorkflowsEndpoint(this.http);
    this.images = new ImagesEndpoint(this.http);
  }
}
