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
 *
 * When a Zod schema is supplied, the response is run through `schema.safeParse(...)`;
 * on a success the parsed value is returned, on a failure the issue list is logged via
 * `req.getLogger()` and the original payload is returned as `T`. This mirrors the
 * "validate but don't crash" mode documented in the README — consumers that need
 * strict validation can call `Schema.parse(response)` themselves.
 */
class EndpointDo {
    /**
     * Constructor.
     *
     * @param req The object to use to make requests.
     * @param endpointPath The path prefix prepended to every string URL passed to a verb
     *   method, e.g. `/campaigns`.
     * @param resolvePrefix Optional resolver returning a prefix prepended at request
     *   time (used by site-root endpoints to inject the requester's current site base
     *   URL lazily, so a later `setBaseUrl(...)` is picked up).
     */
    constructor(req, endpointPath, resolvePrefix) {
        this.req = req;
        this.endpointPath = endpointPath;
        this.resolvePrefix = resolvePrefix;
        /**
         * Resolves a `string | UrlBuilder` into a plain URL string suitable for the requester.
         *
         * String paths are prefixed with `endpointPath` (and the optional resolved prefix);
         * builders are returned via `toString()` unchanged because they already carry the
         * prefix via the resolver passed to {@link UrlBuilder}.
         *
         * @param url The url or builder to resolve.
         */
        this.resolve = (url) => {
            if (typeof url !== 'string') {
                return url.toString();
            }
            const prefix = this.resolvePrefix ? this.resolvePrefix() : '';
            return `${prefix}${this.endpointPath}${url}`;
        };
        /**
         * Validates a raw response against an optional Zod schema, logging mismatches.
         *
         * @param raw The raw response payload.
         * @param schema The schema to validate against, when one was supplied.
         * @param url The URL the response came from (for log context).
         */
        this.validate = (raw, schema, url) => {
            if (!schema) {
                return raw;
            }
            const result = schema.safeParse(raw);
            if (result.success) {
                return result.data;
            }
            this.req.getLogger().error('Response shape mismatch', {
                url,
                issues: result.error.issues,
            });
            return raw;
        };
        /**
         * Makes a GET request to a path relative to the endpoint root.
         *
         * @param url Path string (prepended with the endpoint root) or a pre-built UrlBuilder.
         * @param schema Optional Zod schema to validate the response against.
         * @param authenticate Whether to authenticate the request.
         */
        this.get = async (url, schema, authenticate = true) => {
            const resolved = this.resolve(url);
            const raw = await this.req.doGet(resolved, authenticate);
            return this.validate(raw, schema, resolved);
        };
        /**
         * Makes a POST request to a path relative to the endpoint root.
         *
         * @param url Path string (prepended with the endpoint root) or a pre-built UrlBuilder.
         * @param body The body to send. Serialised to JSON by the underlying requester.
         * @param schema Optional Zod schema to validate the response against.
         * @param authenticate Whether to authenticate the request.
         */
        this.post = async (url, body, schema, authenticate = true) => {
            const resolved = this.resolve(url);
            const raw = await this.req.doPost(resolved, body, authenticate);
            return this.validate(raw, schema, resolved);
        };
        /**
         * Makes a PUT request to a path relative to the endpoint root.
         *
         * @param url Path string (prepended with the endpoint root) or a pre-built UrlBuilder.
         * @param body The body to send. Serialised to JSON by the underlying requester.
         * @param schema Optional Zod schema to validate the response against.
         * @param authenticate Whether to authenticate the request.
         */
        this.put = async (url, body, schema, authenticate = true) => {
            const resolved = this.resolve(url);
            const raw = await this.req.doPut(resolved, body, authenticate);
            return this.validate(raw, schema, resolved);
        };
        /**
         * Makes a DELETE request to a path relative to the endpoint root.
         *
         * The body is optional; when supplied it is sent as JSON, otherwise the request goes
         * out without one.
         *
         * @param url Path string (prepended with the endpoint root) or a pre-built UrlBuilder.
         * @param schema Optional Zod schema to validate the response against.
         * @param authenticate Whether to authenticate the request.
         * @param body The body to send.
         */
        this.del = async (url, schema, authenticate = true, body = undefined) => {
            const resolved = this.resolve(url);
            const raw = await this.req.doDelete(resolved, authenticate, body);
            return this.validate(raw, schema, resolved);
        };
        /**
         * Makes a raw request with caller-supplied `RequestInit` options.
         *
         * Escape hatch for cases that don't fit the JSON-in / JSON-out shape of the verb
         * helpers — for example, a GET that needs a custom `Accept` header and returns a binary
         * payload as text. Schema validation is intentionally not applied here because the
         * response can be any media type.
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
