import { Logger } from './Logger';
import NoopLogger from './NoopLogger';
import { getBaseUrl, setBaseUrl } from './constants';
import CampaignsEndpoint from './endpoint/CampaignsEndpoint';
import ClaimsEndpoint from './endpoint/ClaimsEndpoint';
import OrganizationsEndpoint from './endpoint/OrganizationsEndpoint';
import ScannersEndpoint from './endpoint/Scanners';
import TemplatesEndpoint from './endpoint/TemplatesEndpoint';
import WorkflowsEndpoint from './endpoint/WorkflowsEndpoint';
import { AuthProvider } from './provider/AuthProvider';
import { Requester } from './types/Requester';

/**
 * Client class that communicates with the the addtowallet API.
 */
export default class Client implements Requester {
  /**
   * The authentication object.
   */
  public auth?: AuthProvider;

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
   * The scanners endpoint.
   */
  protected _scanners?: ScannersEndpoint;

  /**
   * The workflows endpoint.
   */
  protected _workflows?: WorkflowsEndpoint;

  /**
   * Constructor.
   *
   * @param auth The authentication provider.
   * @param logger The logger to use.
   */
  constructor(auth?: AuthProvider, logger?: Logger) {
    this.logger = logger || new NoopLogger();
    if (auth) {
      this.setAuth(auth);
    }
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
   * Returns the scanners endpoint.
   */
  public get scanners(): ScannersEndpoint {
    if (!this._scanners) {
      this._scanners = new ScannersEndpoint(this);
    }

    return this._scanners;
  }

  /**
   * Returns the workflows endpoint.
   */
  public get workflows(): WorkflowsEndpoint {
    if (!this._workflows) {
      this._workflows = new WorkflowsEndpoint(this);
    }

    return this._workflows;
  }

  /**
   * Sends a request using the fetcher and returns the response.
   *
   * Adds the bearer token to the headers and catches errors.
   *
   * @param url The url to send the request to.
   * @param options The fetch options.
   * @param authenticate Whether to authenticate the request.
   * @returns The response from the endpoint.
   */
  public fetch = async <T>(
    url: string,
    options: RequestInit = {},
    authenticate = true,
  ): Promise<T> => {
    const sep = url.includes('?') ? '&' : '?';
    url = `${getBaseUrl()}${url}${sep}api=true`;

    const headers = options.headers ? new Headers(options.headers) : new Headers();
    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json');
    }
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    // Adds the bearer token to the headers, and ensures the json headers are
    // set. The caller *might* want to override the json headers (like when
    // uploading a multipart file), so we don't overwrite them if they are set.
    if (authenticate && this.auth) {
      const bearerToken = await this.auth.authenticate();
      headers.set('Authorization', `Bearer ${bearerToken}`);
    }

    this.logger.debug(
      `${options?.method || 'GET'} ${url}, ${authenticate ? 'authenticate' : 'no authenticate'}, body: ${options.body ? JSON.stringify(options.body) : 'none'}`,
    );

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

        const body = await resp.text();
        let json: any = body;
        try {
          json = JSON.parse(body);
        } catch (err) {
          // Do nothing
        }

        if (typeof json === 'string') {
          throw new Error(`Response failed: ${resp.status} ${body}`);
        }
        if (json.error) {
          throw new Error(`${resp.status} ${json.error}`);
        }
        throw new Error(`Response failed: ${resp.status} ${resp.statusText}`);
      })
      .catch((err: any) => {
        throw new Error(`Response failed: ${err.toString()}`);
      });
  };
}
