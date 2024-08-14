import { AuthProvider } from './AuthProvider';
import CampaignsEndpoint from './CampaignsEndpoint';
import ClaimsEndpoint from './ClaimsEndpoint';
import { Logger } from './Logger';
import NoopLogger from './NoopLogger';
import OrganizationsEndpoint from './OrganizationsEndpoint';
import { Requester } from './Requester';
import TemplatesEndpoint from './TemplatesEndpoint';
import { getBaseUrl, setBaseUrl } from './constants';

/**
 * Client class that communicates with the the addtowallet API.
 */
export default class Client implements Requester {
  /**
   * The authentication object.
   */
  public auth!: AuthProvider;

  /**
   * The logger.
   */
  protected logger: Logger;

  /**
   * The campaigns endpoint.
   */
  protected _campaigns?: CampaignsEndpoint;

  /**
   * The claims endpoint.
   */
  protected _claims?: ClaimsEndpoint;

  /**
   * The templates endpoint.
   */
  protected _templates?: TemplatesEndpoint;

  /**
   * The organizations endpoint.
   */
  protected _organizations?: OrganizationsEndpoint;

  /**
   * Constructor.
   *
   * @param auth The authentication provider.
   * @param logger The logger to use.
   */
  constructor(auth: AuthProvider, logger?: Logger) {
    this.logger = logger || new NoopLogger();
    this.setAuth(auth);
  }

  /**
   * Sets the base URL for all requests to the API.
   *
   * @param url The base URL for all requests to the API.
   */
  public setBaseUrl = (url: string) => {
    setBaseUrl(url);
  };

  /**
   * Sets the auth provider to use.
   *
   * @param auth The auth provider to use.
   */
  public setAuth = (auth: AuthProvider) => {
    this.auth = auth;
    this.auth.setLogger(this.logger);
  };

  /**
   * Returns the campaigns endpoint.
   *
   * @returns {CampaignsEndpoint} The campaigns endoint.
   */
  public get campaigns(): CampaignsEndpoint {
    if (!this._campaigns) {
      this._campaigns = new CampaignsEndpoint(this);
    }

    return this._campaigns;
  }

  /**
   * Returns the claims endpoint.
   *
   * @returns {ClaimsEndpoint} The claims endpoint.
   */
  public get claims(): ClaimsEndpoint {
    if (!this._claims) {
      this._claims = new ClaimsEndpoint(this);
    }

    return this._claims;
  }

  /**
   * Returns the templates endpoint.
   */
  public get templates(): TemplatesEndpoint {
    if (!this._templates) {
      this._templates = new TemplatesEndpoint(this);
    }

    return this._templates;
  }

  /**
   * Returns the organizations endpoint.
   */
  public get organizations(): OrganizationsEndpoint {
    if (!this._organizations) {
      this._organizations = new OrganizationsEndpoint(this);
    }

    return this._organizations;
  }

  /**
   * Sends a request using the fetcher and returns the response.
   *
   * Adds the bearer token to the headers and catches errors.
   *
   * @param url The url to send the request to.
   * @param options The fetch options.
   * @returns The response from the endpoint.
   */
  public fetch = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    url = `${getBaseUrl()}${url}`;

    // Adds the bearer token to the headers, and ensures the json headers are
    // set. The caller *might* want to override the json headers (like when
    // uploading a multipart file), so we don't overwrite them if they are set.
    const bearerToken = await this.auth.authenticate();
    const headers = options.headers ? new Headers(options.headers) : new Headers();
    headers.set('Authorization', `Bearer ${bearerToken}`);
    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json');
    }
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    this.logger.debug(`${options?.method || 'GET'} ${url}, Bearer ${bearerToken}`);

    const opts: RequestInit = {
      ...options,
      headers,
    };

    return await fetch(url, opts)
      .then(async (resp) => {
        if (resp.ok) {
          if (headers.get('Accept') === 'application/json') {
            return resp.json() as T;
          }
          return resp.text() as unknown as T;
        }

        const body = await resp.json();
        if (body && body.error) {
          throw new Error(`${resp.status} ${body.error}`);
        }
        throw new Error(`Response failed: ${resp.status} ${resp.statusText}`);
      })
      .catch((err: any) => {
        throw new Error(`Response failed: ${err.toString()}`);
      });
  };
}
