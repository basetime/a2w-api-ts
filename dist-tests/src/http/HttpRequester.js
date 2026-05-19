"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const version_1 = require("../version");
const NoopLogger_1 = __importDefault(require("../NoopLogger"));
const constants_1 = require("../constants");
const ApiError_1 = require("./ApiError");
/**
 * Makes authenticated HTTP requests to the Addtowallet API.
 *
 * All state — base URL, auth provider, logger, user agent — lives on the instance, so
 * multiple `HttpRequester` (and therefore `Client`) instances may coexist in the same
 * process targeting different environments.
 */
class HttpRequester {
    /**
     * Constructor.
     *
     * @param auth The authentication provider.
     * @param logger The logger to use.
     * @param options Additional options (currently just `baseUrl`).
     */
    constructor(auth, logger, options = {}) {
        /**
         * The user agent string.
         */
        this.userAgent = '';
        /**
         * @inheritdoc
         */
        this.setBaseUrl = (url) => {
            this.baseUrl = url;
            this.siteBaseUrl = deriveSiteBaseUrl(url);
            if (this._auth) {
                this._auth.setBaseUrl(url);
            }
        };
        /**
         * @inheritdoc
         */
        this.getBaseUrl = () => {
            return this.baseUrl;
        };
        /**
         * @inheritdoc
         */
        this.getSiteBaseUrl = () => {
            return this.siteBaseUrl;
        };
        /**
         * @inheritdoc
         */
        this.setAuth = (auth) => {
            this._auth = auth;
            auth.setLogger(this.logger);
            auth.setBaseUrl(this.baseUrl);
        };
        /**
         * @inheritdoc
         */
        this.setUserAgent = (userAgent) => {
            this.userAgent = userAgent;
        };
        /**
         * @inheritdoc
         */
        this.getLogger = () => {
            return this.logger;
        };
        /**
         * @inheritdoc
         */
        this.doGet = async (url, authenticate = true) => {
            return await this.fetch(url, { method: 'GET' }, authenticate);
        };
        /**
         * @inheritdoc
         */
        this.doPost = async (url, body, authenticate = true) => {
            return await this.fetch(url, {
                method: 'POST',
                body: JSON.stringify(body),
            }, authenticate);
        };
        /**
         * @inheritdoc
         */
        this.doPut = async (url, body, authenticate = true) => {
            return await this.fetch(url, {
                method: 'PUT',
                body: JSON.stringify(body),
            }, authenticate);
        };
        /**
         * @inheritdoc
         */
        this.doDelete = async (url, authenticate = true, body = undefined) => {
            const options = { method: 'DELETE' };
            if (body !== undefined) {
                options.body = JSON.stringify(body);
            }
            return await this.fetch(url, options, authenticate);
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
        this.fetch = async (url, options = {}, authenticate = true) => {
            return this.fetchInternal(url, options, authenticate, false);
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
        this.fetchInternal = async (url, options, authenticate, isRetry) => {
            const resolvedUrl = this.resolveUrl(url);
            const headers = await this.buildHeaders(options, authenticate);
            const opts = { ...options, headers };
            this.logger.debug(`${options?.method || 'GET'} ${resolvedUrl}, ${authenticate ? 'authenticate' : 'no authenticate'}, body: ${options.body ? JSON.stringify(options.body) : 'none'}`);
            const resp = await fetch(resolvedUrl, opts);
            if (resp.ok) {
                if (headers.get('Accept') === 'application/json') {
                    return (await resp.json());
                }
                return (await resp.text());
            }
            if (resp.status === 401 && authenticate && this._auth && !isRetry) {
                this.logger.debug(`401 from ${resolvedUrl}, attempting token refresh`);
                try {
                    await this._auth.refresh();
                }
                catch (err) {
                    this.logger.error(`Token refresh failed: ${err.message ?? err}`);
                }
                return this.fetchInternal(url, options, authenticate, true);
            }
            const rawBody = await resp.text();
            let parsedBody = rawBody;
            let parseError;
            try {
                parsedBody = JSON.parse(rawBody);
            }
            catch (err) {
                parseError = err;
            }
            throw new ApiError_1.ApiError(resp.status, resp.statusText, parsedBody, resolvedUrl, {
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
        this.resolveUrl = (url) => {
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
        this.buildHeaders = async (options, authenticate) => {
            const headers = options.headers ? new Headers(options.headers) : new Headers();
            if (this.userAgent) {
                headers.set('User-Agent', this.userAgent);
            }
            else {
                headers.set('User-Agent', `a2w-api-ts/${version_1.version} (Node.js ${process.version})`);
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
                }
                else {
                    const bearerToken = await this._auth.authenticate();
                    headers.set('Authorization', `Bearer ${bearerToken}`);
                }
            }
            return headers;
        };
        this.logger = logger || new NoopLogger_1.default();
        this.baseUrl = options.baseUrl ?? constants_1.DEFAULT_BASE_URL;
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
    get auth() {
        return this._auth;
    }
}
exports.default = HttpRequester;
/**
 * Derives the site base URL from the API base URL by stripping a trailing `/api/v1`
 * segment (with or without a trailing slash). Returns the input unchanged when no such
 * segment is present.
 *
 * @param baseUrl The API base URL.
 */
const deriveSiteBaseUrl = (baseUrl) => {
    return baseUrl.replace(/\/api\/v1\/?$/, '');
};
