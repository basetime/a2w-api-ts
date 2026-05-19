import { version } from '../version';
import { Logger } from '../Logger';
import NoopLogger from '../NoopLogger';
import { DEFAULT_BASE_URL } from '../constants';
import { AuthProvider } from '../provider/AuthProvider';
import { ApiError } from './ApiError';
import { Requester } from './Requester';

/**
 * Options accepted by `HttpRequester`.
 */
export interface HttpRequesterOptions {
  /**
   * The API base URL. Defaults to {@link DEFAULT_BASE_URL}.
   */
  baseUrl?: string;
}

/**
 * Makes authenticated HTTP requests to the Addtowallet API.
 *
 * All state — base URL, auth provider, logger, user agent — lives on the instance, so
 * multiple `HttpRequester` (and therefore `Client`) instances may coexist in the same
 * process targeting different environments.
 */
export default class HttpRequester implements Requester {
  /**
   * The authentication object.
   *
   * Exposed via a read-only getter. Use {@link setAuth} to change it so the logger and
   * base URL are wired into the new provider.
   */
  private _auth?: AuthProvider;

  /**
   * The logger.
   */
  protected logger: Logger;

  /**
   * The user agent string.
   */
  protected userAgent: string = '';

  /**
   * The API base URL (e.g. `https://app.addtowallet.io/api/v1`).
   */
  protected baseUrl: string;

  /**
   * The derived site base URL (the API base URL with a trailing `/api/v1` stripped).
   *
   * Used by `siteRoot`-mode endpoints like `BarcodesEndpoint` and `WidgetsEndpoint`
   * to target routes mounted outside `/api/v1`.
   */
  protected siteBaseUrl: string;

  /**
   * Constructor.
   *
   * @param auth The authentication provider.
   * @param logger The logger to use.
   * @param options Additional options (currently just `baseUrl`).
   */
  constructor(auth?: AuthProvider, logger?: Logger, options: HttpRequesterOptions = {}) {
    this.logger = logger || new NoopLogger();
    this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
    this.siteBaseUrl = deriveSiteBaseUrl(this.baseUrl);
    if (auth) {
      this.setAuth(auth);
    }
  }

  /**
   * The authentication provider currently in use.
   *
   * Read-only from outside the class; assignment is a TypeScript error. Use
   * {@link setAuth} to change it.
   */
  public get auth(): AuthProvider | undefined {
    return this._auth;
  }

  /**
   * @inheritdoc
   */
  public setBaseUrl = (url: string) => {
    this.baseUrl = url;
    this.siteBaseUrl = deriveSiteBaseUrl(url);
    if (this._auth) {
      this._auth.setBaseUrl(url);
    }
  };

  /**
   * @inheritdoc
   */
  public getBaseUrl = (): string => {
    return this.baseUrl;
  };

  /**
   * @inheritdoc
   */
  public getSiteBaseUrl = (): string => {
    return this.siteBaseUrl;
  };

  /**
   * @inheritdoc
   */
  public setAuth = (auth: AuthProvider) => {
    this._auth = auth;
    auth.setLogger(this.logger);
    auth.setBaseUrl(this.baseUrl);
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
  public getLogger = (): Logger => {
    return this.logger;
  };

  /**
   * @inheritdoc
   */
  public doGet = async <T>(url: string, authenticate = true): Promise<T> => {
    return await this.fetch<T>(url, { method: 'GET' }, authenticate);
  };

  /**
   * @inheritdoc
   */
  public doPost = async <T>(url: string, body: any, authenticate = true): Promise<T> => {
    return await this.fetch<T>(
      url,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      authenticate,
    );
  };

  /**
   * @inheritdoc
   */
  public doPut = async <T>(url: string, body: any, authenticate = true): Promise<T> => {
    return await this.fetch<T>(
      url,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
      authenticate,
    );
  };

  /**
   * @inheritdoc
   */
  public doDelete = async <T>(url: string, authenticate = true, body: any = undefined): Promise<T> => {
    const options: RequestInit = { method: 'DELETE' };
    if (body !== undefined) {
      options.body = JSON.stringify(body);
    }
    return await this.fetch<T>(url, options, authenticate);
  };

  /**
   * @inheritdoc
   *
   * When `url` is a fully-qualified URL (starts with `http://` or `https://`) it is used
   * as-is without prepending the configured API base URL and without injecting the
   * `api=true` marker. This lets endpoint helpers target routes that live outside
   * `/api/v1` (e.g. `/barcodes`, `/widgets`) while still benefiting from the shared
   * header, auth, and error-handling logic.
   *
   * On a 401 response and when an auth provider is configured, the request is retried
   * once after `auth.refresh()` succeeds; further 401s are surfaced as `ApiError`s.
   */
  public fetch = async <T>(
    url: string,
    options: RequestInit = {},
    authenticate = true,
  ): Promise<T> => {
    return this.fetchInternal<T>(url, options, authenticate, false);
  };

  /**
   * Internal implementation of {@link fetch} that tracks whether the current call is
   * already a 401 retry, so we never recurse more than once.
   *
   * @param url The url to send the request to.
   * @param options The fetch options.
   * @param authenticate Whether to authenticate the request.
   * @param isRetry Whether this is the 401-recovery retry pass.
   */
  private fetchInternal = async <T>(
    url: string,
    options: RequestInit,
    authenticate: boolean,
    isRetry: boolean,
  ): Promise<T> => {
    const resolvedUrl = this.resolveUrl(url);
    const headers = await this.buildHeaders(options, authenticate);
    const opts: RequestInit = { ...options, headers };

    this.logger.debug(
      `${options?.method || 'GET'} ${resolvedUrl}, ${authenticate ? 'authenticate' : 'no authenticate'}, body: ${options.body ? JSON.stringify(options.body) : 'none'}`,
    );

    const resp = await fetch(resolvedUrl, opts);

    if (resp.ok) {
      if (headers.get('Accept') === 'application/json') {
        return (await resp.json()) as T;
      }
      return (await resp.text()) as unknown as T;
    }

    if (resp.status === 401 && authenticate && this._auth && !isRetry) {
      this.logger.debug(`401 from ${resolvedUrl}, attempting token refresh`);
      try {
        await this._auth.refresh();
      } catch (err) {
        this.logger.error(`Token refresh failed: ${(err as Error).message ?? err}`);
      }
      return this.fetchInternal<T>(url, options, authenticate, true);
    }

    const rawBody = await resp.text();
    let parsedBody: unknown = rawBody;
    let parseError: unknown;
    try {
      parsedBody = JSON.parse(rawBody);
    } catch (err) {
      parseError = err;
    }

    throw new ApiError(resp.status, resp.statusText, parsedBody, resolvedUrl, {
      cause: parseError,
    });
  };

  /**
   * Resolves a caller-supplied URL into the final absolute URL that will be sent.
   *
   * - Absolute URLs (`http://`/`https://`) are returned unchanged.
   * - Relative URLs are joined with {@link baseUrl}.
   * - The `api=true` marker is appended to the resolved URL's query string only when
   *   it isn't already present.
   *
   * @param url The raw URL passed to {@link fetch}.
   */
  private resolveUrl = (url: string): string => {
    const isAbsolute = /^https?:\/\//i.test(url);
    if (isAbsolute) {
      const parsed = new URL(url);
      if (!parsed.searchParams.has('api')) {
        parsed.searchParams.set('api', 'true');
      }
      return parsed.toString();
    }

    const base = this.baseUrl.replace(/\/$/, '');
    const path = url.startsWith('/') ? url : `/${url}`;
    const parsed = new URL(`${base}${path}`);
    if (!parsed.searchParams.has('api')) {
      parsed.searchParams.set('api', 'true');
    }
    return parsed.toString();
  };

  /**
   * Builds the headers for a single request: User-Agent, default Accept/Content-Type,
   * and (when applicable) Authorization.
   *
   * @param options The caller's fetch options.
   * @param authenticate Whether to attach the bearer token.
   */
  private buildHeaders = async (
    options: RequestInit,
    authenticate: boolean,
  ): Promise<Headers> => {
    const headers = options.headers ? new Headers(options.headers) : new Headers();
    if (this.userAgent) {
      headers.set('User-Agent', this.userAgent);
    } else {
      headers.set('User-Agent', `a2w-api-ts/${version} (Node.js ${process.version})`);
    }
    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json');
    }
    // Default to JSON when the body is a string (or absent). Skip for FormData/Blob/etc.
    // so the runtime can attach the correct multipart boundary automatically.
    const isStringBody = typeof options.body === 'string' || options.body == null;
    if (!headers.has('Content-Type') && isStringBody) {
      headers.set('Content-Type', 'application/json');
    }

    if (authenticate && this._auth) {
      const authed = this._auth.getAuthed();
      if (authed) {
        headers.set('Authorization', `Bearer ${authed.idToken}`);
      } else {
        const bearerToken = await this._auth.authenticate();
        headers.set('Authorization', `Bearer ${bearerToken}`);
      }
    }

    return headers;
  };
}

/**
 * Derives the site base URL from the API base URL by stripping a trailing `/api/v1`
 * segment (with or without a trailing slash). Returns the input unchanged when no such
 * segment is present.
 *
 * @param baseUrl The API base URL.
 */
const deriveSiteBaseUrl = (baseUrl: string): string => {
  return baseUrl.replace(/\/api\/v1\/?$/, '');
};
