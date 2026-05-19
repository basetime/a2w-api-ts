import { Logger } from '../Logger';
import { AuthProvider } from '../provider/AuthProvider';

/**
 * Represents a class that can make HTTP requests to the Addtowallet API.
 *
 * This interface decouples endpoint classes from any particular HTTP implementation. Endpoints
 * accept a `Requester` rather than a concrete `HttpRequester`, which lets unit tests substitute
 * a stub or fake without spinning up the real wire layer. The canonical implementation is
 * `HttpRequester`.
 */
export interface Requester {
  /**
   * Sets the base URL for all requests to the API.
   *
   * Mutates this requester's instance state only — different `HttpRequester` instances
   * keep independent base URLs. The site base URL (returned by {@link getSiteBaseUrl})
   * is recomputed by stripping a trailing `/api/v1` segment.
   *
   * @param url The base URL for all requests to the API.
   */
  setBaseUrl(url: string): void;

  /**
   * Returns the API base URL currently in use.
   */
  getBaseUrl(): string;

  /**
   * Returns the site base URL (the API base URL with a trailing `/api/v1` stripped).
   *
   * Used by endpoints that target routes mounted at the site root rather than under
   * `/api/v1` (e.g. `/barcodes`, `/widgets`).
   */
  getSiteBaseUrl(): string;

  /**
   * Sets the auth provider to use.
   *
   * When set, authenticated requests automatically attach a bearer token obtained from the
   * provider's cached `getAuthed()` value or, if absent, a fresh `authenticate()` call. The
   * provider is also wired up with the requester's logger so its authentication attempts log
   * through the same sink, and with the requester's current base URL so its auth requests
   * target the same origin.
   *
   * @param auth The auth provider to use.
   */
  setAuth(auth: AuthProvider): void;

  /**
   * Sets the user agent string.
   *
   * Overrides the default `a2w-api-ts/<version> (Node.js <version>)` header sent with every
   * request. Callers wrapping the library in their own product should set this so their traffic
   * is identifiable in API logs.
   *
   * @param userAgent The user agent string to use.
   */
  setUserAgent(userAgent: string): void;

  /**
   * Returns the logger used by this requester.
   *
   * Exposed so downstream collaborators (e.g. {@link EndpointDo}'s schema validator) can
   * log through the same sink as the requester itself.
   */
  getLogger(): Logger;

  /**
   * Sends a request using the fetcher and returns the response.
   *
   * Adds the bearer token to the headers and surfaces non-2xx responses as
   * `ApiError` instances (with `status`, `body`, and `url` fields). JSON `Accept` and
   * `Content-Type` headers are applied unless the caller has already set them
   * (e.g. for multipart uploads).
   *
   * @param url The url to send the request to.
   * @param options The fetch options.
   * @param authenticate Whether to authenticate the request.
   */
  fetch: <T>(url: string, options: RequestInit, authenticate?: boolean) => Promise<T>;

  /**
   * Makes a GET request.
   *
   * Thin convenience wrapper around `fetch` that sets `method: 'GET'` and forwards the
   * authentication flag.
   *
   * @param url The url to fetch.
   * @param authenticate Whether to authenticate the request.
   */
  doGet: <T>(url: string, authenticate?: boolean) => Promise<T>;

  /**
   * Makes a POST request.
   *
   * Thin convenience wrapper around `fetch` that sets `method: 'POST'` and forwards the
   * authentication flag.
   *
   * @param url The url to fetch.
   * @param body The body to send.
   * @param authenticate Whether to authenticate the request.
   */
  doPost: <T>(url: string, body: any, authenticate?: boolean) => Promise<T>;

  /**
   * Makes a PUT request.
   *
   * Thin convenience wrapper around `fetch` that sets `method: 'PUT'` and forwards the
   * authentication flag.
   *
   * @param url The url to fetch.
   * @param body The body to send.
   * @param authenticate Whether to authenticate the request.
   */
  doPut: <T>(url: string, body: any, authenticate?: boolean) => Promise<T>;

  /**
   * Makes a DELETE request.
   *
   * Thin convenience wrapper around `fetch` that sets `method: 'DELETE'` and forwards the
   * authentication flag.
   *
   * @param url The url to fetch.
   * @param authenticate Whether to authenticate the request.
   * @param body The body to send.
   */
  doDelete: <T>(url: string, authenticate?: boolean, body?: any) => Promise<T>;
}
