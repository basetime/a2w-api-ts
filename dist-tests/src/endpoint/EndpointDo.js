"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Verb wrapper bound to a single endpoint path prefix.
 *
 * Each `Endpoint` subclass owns an `EndpointDo` constructed with its own root path
 * (e.g. `/campaigns`). Callers pass paths that are **relative** to that root —
 * `this.do.get('/{id}/passes')` — and the wrapper takes care of prepending the prefix
 * before delegating to the injected `Requester`.
 *
 * When a {@link UrlBuilder} is passed instead of a string the wrapper assumes it already
 * carries the endpoint prefix (this is what `Endpoint`'s `this.qb.create(...)` returns)
 * and uses its `toString()` output as-is to avoid double-prefixing.
 */
class EndpointDo {
    /**
     * Constructor.
     *
     * @param req The object to use to make requests.
     * @param endpointPath The path prefix prepended to every string URL passed to a verb
     *   method, e.g. `/campaigns`.
     */
    constructor(req, endpointPath) {
        this.req = req;
        this.endpointPath = endpointPath;
        /**
         * Resolves a `string | UrlBuilder` into a plain relative URL string.
         *
         * String paths are prefixed with `endpointPath`; builders are returned via
         * `toString()` unchanged (they're expected to already carry the prefix).
         *
         * @param url The url or builder to resolve.
         */
        this.resolve = (url) => (typeof url === 'string' ? `${this.endpointPath}${url}` : url.toString());
        /**
         * Makes a GET request to a path relative to the endpoint root.
         *
         * @param url Path string (prepended with the endpoint root) or a pre-built UrlBuilder.
         * @param authenticate Whether to authenticate the request.
         */
        this.get = async (url, authenticate = true) => {
            return await this.req.doGet(this.resolve(url), authenticate);
        };
        /**
         * Makes a POST request to a path relative to the endpoint root.
         *
         * @param url Path string (prepended with the endpoint root) or a pre-built UrlBuilder.
         * @param body The body to send. Serialised to JSON by the underlying requester.
         * @param authenticate Whether to authenticate the request.
         */
        this.post = async (url, body, authenticate = true) => {
            return await this.req.doPost(this.resolve(url), body, authenticate);
        };
        /**
         * Makes a PUT request to a path relative to the endpoint root.
         *
         * @param url Path string (prepended with the endpoint root) or a pre-built UrlBuilder.
         * @param body The body to send. Serialised to JSON by the underlying requester.
         * @param authenticate Whether to authenticate the request.
         */
        this.put = async (url, body, authenticate = true) => {
            return await this.req.doPut(this.resolve(url), body, authenticate);
        };
        /**
         * Makes a DELETE request to a path relative to the endpoint root.
         *
         * The body is optional; when supplied it is sent as JSON, otherwise the request goes
         * out without one.
         *
         * @param url Path string (prepended with the endpoint root) or a pre-built UrlBuilder.
         * @param authenticate Whether to authenticate the request.
         * @param body The body to send.
         */
        this.del = async (url, authenticate = true, body = undefined) => {
            return await this.req.doDelete(this.resolve(url), authenticate, body);
        };
        /**
         * Makes a raw request with caller-supplied `RequestInit` options.
         *
         * Escape hatch for cases that don't fit the JSON-in / JSON-out shape of the verb
         * helpers — for example, a GET that needs a custom `Accept` header and returns a binary
         * payload as text.
         *
         * @param url Path string (prepended with the endpoint root) or a pre-built UrlBuilder.
         * @param options The fetch options. Defaults to an empty object (GET, default headers).
         * @param authenticate Whether to authenticate the request.
         */
        this.fetch = async (url, options = {}, authenticate = true) => {
            return await this.req.fetch(this.resolve(url), options, authenticate);
        };
    }
}
exports.default = EndpointDo;
