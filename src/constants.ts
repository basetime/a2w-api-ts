/**
 * The default API base URL used by `HttpRequester` when no override is supplied.
 *
 * Each `HttpRequester` instance keeps its own base URL on `this.baseUrl`; this is just the
 * fallback. Override per-instance via `client.http.setBaseUrl(...)` or by passing
 * `{ baseUrl }` to the `Client`/`HttpRequester` constructor.
 */
export const DEFAULT_BASE_URL = 'https://app.addtowallet.io/api/v1';
