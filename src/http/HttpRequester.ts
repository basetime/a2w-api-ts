import { version } from '../version';
import { Logger } from '../Logger';
import NoopLogger from '../NoopLogger';
import { getBaseUrl, setBaseUrl } from '../constants';
import { AuthProvider } from '../provider/AuthProvider';
import { Requester } from './Requester';

/**
 * Represents a class that can make authenticated HTTP requests
 * to the Addtowallet API.
 */
export default class HttpRequester implements Requester {
  /**
   * The authentication object.
   */
  public auth?: AuthProvider;

  /**
   * The logger.
   */
  protected logger: Logger;

  /**
   * The user agent string.
   */
  protected userAgent: string = '';

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
   * @inheritdoc
   */
  public setBaseUrl = (url: string) => {
    setBaseUrl(url);
  };

  /**
   * @inheritdoc
   */
  public setAuth = (auth: AuthProvider) => {
    this.auth = auth;
    this.auth.setLogger(this.logger);
  };

  /**
   * @inheritdoc
   */
  public setUserAgent = (userAgent: string) => {
    this.userAgent = userAgent;
  };

  /**
   * @inheritdoc
   */
  public doGet = async <T>(url: string, authenticate = true): Promise<T> => {
    return await this.fetch<T>(
      url,
      {
        method: 'GET',
      },
      authenticate,
    );
  };
  /**
   * @inheritdoc
   */
  public doPost = async <T>(url: string, body: any, authenticate = true): Promise<T> => {
    const options: RequestInit = {
      method: 'POST',
      body: JSON.stringify(body),
    };

    return await this.fetch<T>(url, options, authenticate);
  };

  /**
   * @inheritdoc
   */
  public doPut = async <T>(url: string, body: any, authenticate = true): Promise<T> => {
    const options: RequestInit = {
      method: 'PUT',
      body: JSON.stringify(body),
    };

    return await this.fetch<T>(url, options, authenticate);
  };

  /**
   * @inheritdoc
   */
  public doDelete = async <T>(url: string, authenticate = true, body: any = undefined): Promise<T> => {
    const options: RequestInit = {
      method: 'DELETE',
    };
    if (body) {
      options.body = JSON.stringify(body);
    }

    return await this.fetch<T>(
      url,
      options,
      authenticate,
    );
  };

  /**
   * @inheritdoc
   */
  public fetch = async <T>(
    url: string,
    options: RequestInit = {},
    authenticate = true,
  ): Promise<T> => {
    const sep = url.includes('?') ? '&' : '?';
    url = `${getBaseUrl()}${url}${sep}api=true`;

    const headers = options.headers ? new Headers(options.headers) : new Headers();
    if (this.userAgent) {
      headers.set('User-Agent', this.userAgent);
    } else {
      headers.set('User-Agent', `a2w-api-ts/${version} (Node.js ${process.version})`);
    }
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
      const authed = this.auth.getAuthed();
      if (authed) {
        headers.set('Authorization', `Bearer ${authed.idToken}`);
      } else {
        const bearerToken = await this.auth.authenticate();
        headers.set('Authorization', `Bearer ${bearerToken}`);
      }
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
