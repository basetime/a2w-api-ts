"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const version_1 = require("../version");
const NoopLogger_1 = __importDefault(require("../NoopLogger"));
const constants_1 = require("../constants");
/**
 * Represents a class that can make authenticated HTTP requests
 * to the Addtowallet API.
 */
class HttpRequester {
    /**
     * Constructor.
     *
     * @param auth The authentication provider.
     * @param logger The logger to use.
     */
    constructor(auth, logger) {
        /**
         * The user agent string.
         */
        this.userAgent = '';
        /**
         * @inheritdoc
         */
        this.setBaseUrl = (url) => {
            (0, constants_1.setBaseUrl)(url);
        };
        /**
         * @inheritdoc
         */
        this.setAuth = (auth) => {
            this.auth = auth;
            this.auth.setLogger(this.logger);
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
        this.doGet = async (url, authenticate = true) => {
            return await this.fetch(url, {
                method: 'GET',
            }, authenticate);
        };
        /**
         * @inheritdoc
         */
        this.doPost = async (url, body, authenticate = true) => {
            const options = {
                method: 'POST',
                body: JSON.stringify(body),
            };
            return await this.fetch(url, options, authenticate);
        };
        /**
         * @inheritdoc
         */
        this.doPut = async (url, body, authenticate = true) => {
            const options = {
                method: 'PUT',
                body: JSON.stringify(body),
            };
            return await this.fetch(url, options, authenticate);
        };
        /**
         * @inheritdoc
         */
        this.doDelete = async (url, authenticate = true, body = undefined) => {
            const options = {
                method: 'DELETE',
            };
            if (body) {
                options.body = JSON.stringify(body);
            }
            return await this.fetch(url, options, authenticate);
        };
        /**
         * @inheritdoc
         *
         * When `url` is a fully-qualified URL (starts with `http://` or `https://`) it is used
         * as-is without prepending the configured API base URL. This lets endpoint helpers
         * target routes that live outside `/api/v1` (e.g. `/barcodes`, `/widgets`) while still
         * benefiting from the shared header, auth, and error-handling logic.
         */
        this.fetch = async (url, options = {}, authenticate = true) => {
            const isAbsolute = /^https?:\/\//i.test(url);
            const sep = url.includes('?') ? '&' : '?';
            url = `${isAbsolute ? '' : (0, constants_1.getBaseUrl)()}${url}${sep}api=true`;
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
            // Adds the bearer token to the headers, and ensures the json headers are
            // set. The caller *might* want to override the json headers (like when
            // uploading a multipart file), so we don't overwrite them if they are set.
            if (authenticate && this.auth) {
                const authed = this.auth.getAuthed();
                if (authed) {
                    headers.set('Authorization', `Bearer ${authed.idToken}`);
                }
                else {
                    const bearerToken = await this.auth.authenticate();
                    headers.set('Authorization', `Bearer ${bearerToken}`);
                }
            }
            this.logger.debug(`${options?.method || 'GET'} ${url}, ${authenticate ? 'authenticate' : 'no authenticate'}, body: ${options.body ? JSON.stringify(options.body) : 'none'}`);
            const opts = {
                ...options,
                headers,
            };
            return await fetch(url, opts)
                .then(async (resp) => {
                if (resp.ok) {
                    if (headers.get('Accept') === 'application/json') {
                        return resp.json();
                    }
                    return resp.text();
                }
                const body = await resp.text();
                let json = body;
                try {
                    json = JSON.parse(body);
                }
                catch (err) {
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
                .catch((err) => {
                throw new Error(`Response failed: ${err.toString()}`);
            });
        };
        this.logger = logger || new NoopLogger_1.default();
        if (auth) {
            this.setAuth(auth);
        }
    }
}
exports.default = HttpRequester;
