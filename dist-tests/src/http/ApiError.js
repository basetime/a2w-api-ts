"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
/**
 * Error thrown by `HttpRequester` for any non-2xx response from the API.
 *
 * Wraps the HTTP status, status text, the parsed response body (JSON when the response
 * was JSON, raw text otherwise), and the absolute request URL. The `cause` option can
 * carry an underlying error (e.g. a `SyntaxError` from JSON parsing) so callers can walk
 * the chain via `err.cause`.
 *
 * The class exists so consumers can `instanceof ApiError` and read structured fields
 * (`err.status`, `err.body`) instead of regexing the message.
 */
class ApiError extends Error {
    /**
     * Constructor.
     *
     * @param status The HTTP status code.
     * @param statusText The HTTP status text.
     * @param body The parsed response body.
     * @param url The absolute URL of the request.
     * @param options Optional `cause` field for chaining underlying errors.
     */
    constructor(status, statusText, body, url, options) {
        const detail = extractDetail(body) ?? statusText;
        super(`${status} ${detail} (${url})`);
        this.name = 'ApiError';
        this.status = status;
        this.statusText = statusText;
        this.body = body;
        this.url = url;
        // Assigned after `super(...)` so the constructor signature stays compatible with
        // older `lib` targets that don't yet declare `ErrorOptions` (the second `Error`
        // constructor arg landed in ES2022).
        if (options && 'cause' in options) {
            this.cause = options.cause;
        }
    }
}
exports.ApiError = ApiError;
/**
 * Pulls a human-readable error message out of a JSON body when present.
 *
 * Looks for the common `{ error: '...' }` or `{ message: '...' }` shapes returned by
 * the backend; returns `undefined` when neither is present so the caller can fall back
 * to `statusText`.
 *
 * @param body The parsed response body.
 */
const extractDetail = (body) => {
    if (!body || typeof body !== 'object') {
        if (typeof body === 'string' && body.length > 0) {
            return body;
        }
        return undefined;
    }
    const record = body;
    if (typeof record.error === 'string') {
        return record.error;
    }
    if (typeof record.message === 'string') {
        return record.message;
    }
    return undefined;
};
