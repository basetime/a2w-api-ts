import Auth from './Auth';
import CampaignsEndpoint from './CampaignsEndpoint';
import ClaimsEndpoint from './ClaimsEndpoint';
import { Fetcher } from './Fetcher';
import { Logger } from './Logger';
import NoopLogger from './NoopLogger';
import { Requester } from './Requester';

/**
 * Client class that communicates with the the addtowallet API.
 */
export default class Client implements Requester {
  /**
   * Base URL for the production environment.
   */
  public static readonly baseProd = 'https://app.addtowallet.io/api/v1';

  /**
   * Base URL for the dev environment.
   */
  public static readonly baseDev = 'https://local.addtowallet.io:5009/api/v1';

  /**
   * The base URL.
   */
  public static readonly baseUrl = this.baseProd;

  /**
   * The fetcher function used to make requests.
   */
  private fetcher: Fetcher = fetch;

  /**
   * The authentication object.
   */
  protected auth!: Auth;

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
   * Constructor.
   *
   * @param key The API key.
   * @param secret The API secret.
   * @param logger The logger to use.
   */
  constructor(key: string, secret: string, logger?: Logger) {
    this.logger = logger || new NoopLogger();
    this.setAuth(new Auth(key, secret, Client.baseUrl));
  }

  /**
   * Sets the auth instance to use.
   *
   * @param auth The auth instance to use.
   */
  public setAuth = (auth: Auth) => {
    this.auth = auth;
    this.auth.setLogger(this.logger);
    this.auth.setFetcher(this.fetcher);
  };

  /**
   * Sets the instance of fetch() to use when making requests.
   *
   * @param fetcher The fetch instance.
   */
  public setFetcher = (fetcher: Fetcher) => {
    this.fetcher = fetcher;
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
   * Sends a request using the fetcher and returns the response.
   *
   * Adds the bearer token to the headers and catches errors.
   *
   * @param url The url to send the request to.
   * @param options The fetch options.
   * @returns The response from the endpoint.
   */
  public do = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    url = `${Client.baseUrl}${url}`;
    this.logger.debug(`Sending request: ${options?.method || 'GET'} ${url}`);

    // Adds the bearer token to the headers, and ensures the json headers are
    // set. The caller *might* want to override the json headers (like when
    // uploading a multipart file), so we don't overwrite them if they are set.
    const bearerToken = await this.auth.getBearerToken();
    const headers = options.headers ? new Headers(options.headers) : new Headers();
    headers.set('Authorization', `Bearer ${bearerToken}`);
    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json');
    }
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const opts: RequestInit = {
      ...options,
      headers,
    };

    return await this.fetcher(url, opts)
      .then((resp) => {
        if (resp.ok) {
          if (headers.get('Accept') === 'application/json') {
            return resp.json() as T;
          }
          return resp.text() as unknown as T;
        }

        throw new Error(`Failed to authenticate: ${resp.statusText}`);
      })
      .catch((err: any) => {
        throw new Error(`Failed to authenticate: ${err.toString()}`);
      });
  };
}
