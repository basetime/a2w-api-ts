"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QueryBuilder_1 = require("../http/QueryBuilder");
/**
 * Parent class for other endpoints.
 *
 * Provides a stable, protected request surface (`doGet`/`doPost`/`doPut`/`doDelete`/`doFetch`)
 * for subclasses to call. The actual HTTP work is delegated to the injected `Requester`, which
 * keeps subclasses free of any direct dependency on `HttpRequester` and trivially testable with
 * a stub requester.
 *
 * Subclasses get a pre-built {@link QueryBuilder} on `this.qb` rooted at their own endpoint
 * path so they can construct request URLs without hand-rolled string concatenation or
 * encoding.
 */
class Endpoint {
    /**
     * Constructor.
     *
     * The requester is typically the shared `HttpRequester` owned by the parent `Client`, but
     * tests may pass any object that satisfies the `Requester` interface.
     *
     * @param req The object to use to make requests.
     * @param endpointPath The path prefix all URLs from `this.qb` are rooted under,
     *   e.g. `/campaigns`.
     */
    constructor(req, endpointPath) {
        this.req = req;
        /**
         * Normalises a `string | UrlBuilder` input into a plain URL string.
         *
         * @param url The url or builder to normalise.
         */
        this.resolveUrl = (url) => {
            return typeof url === 'string' ? url : url.toString();
        };
        /**
         * Makes a GET request.
         *
         * Forwards to the injected `Requester`. Provided so subclasses don't have to reach through
         * `this.req` for the common case. Accepts either a raw URL string or a {@link UrlBuilder};
         * builders are stringified automatically.
         *
         * @param url The url or builder to fetch.
         * @param authenticate Whether to authenticate the request.
         */
        this.doGet = async (url, authenticate = true) => {
            return await this.req.doGet(this.resolveUrl(url), authenticate);
        };
        /**
         * Makes a POST request.
         *
         * Forwards to the injected `Requester`, which handles JSON serialisation and headers.
         * Accepts either a raw URL string or a {@link UrlBuilder}; builders are stringified
         * automatically.
         *
         * @param url The url or builder to fetch.
         * @param body The body to send.
         * @param authenticate Whether to authenticate the request.
         */
        this.doPost = async (url, body, authenticate = true) => {
            return await this.req.doPost(this.resolveUrl(url), body, authenticate);
        };
        /**
         * Makes a PUT request.
         *
         * Forwards to the injected `Requester`, which handles JSON serialisation and headers.
         * Accepts either a raw URL string or a {@link UrlBuilder}; builders are stringified
         * automatically.
         *
         * @param url The url or builder to fetch.
         * @param body The body to send.
         * @param authenticate Whether to authenticate the request.
         */
        this.doPut = async (url, body, authenticate = true) => {
            return await this.req.doPut(this.resolveUrl(url), body, authenticate);
        };
        /**
         * Makes a DELETE request.
         *
         * Forwards to the injected `Requester`. The body is optional; when supplied it is sent as
         * JSON, otherwise the request goes out without one. Accepts either a raw URL string or a
         * {@link UrlBuilder}; builders are stringified automatically.
         *
         * @param url The url or builder to fetch.
         * @param authenticate Whether to authenticate the request.
         * @param body The body to send.
         */
        this.doDelete = async (url, authenticate = true, body = undefined) => {
            return await this.req.doDelete(this.resolveUrl(url), authenticate, body);
        };
        /**
         * Makes a raw request with caller-supplied `RequestInit` options.
         *
         * Escape hatch for the cases that don't fit the JSON-in / JSON-out shape of the verb
         * helpers — for example, a GET that needs a custom `Accept` header and returns a binary
         * payload as text. Accepts either a raw URL string or a {@link UrlBuilder}; builders are
         * stringified automatically.
         *
         * @param url The url or builder to fetch.
         * @param options The fetch options. Defaults to an empty object (GET, default headers).
         * @param authenticate Whether to authenticate the request.
         */
        this.doFetch = async (url, options = {}, authenticate = true) => {
            return await this.req.fetch(this.resolveUrl(url), options, authenticate);
        };
        this.qb = new QueryBuilder_1.QueryBuilder('', endpointPath);
    }
}
exports.default = Endpoint;
