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
   * Useful for pointing the client at a non-production environment such as a staging server or
   * a local mock. When unset, requests target the default Addtowallet API origin.
   *
   * @param url The base URL for all requests to the API.
   */
  setBaseUrl(url: string): void;

  /**
   * Sets the auth provider to use.
   *
   * When set, authenticated requests automatically attach a bearer token obtained from the
   * provider's cached `getAuthed()` value or, if absent, a fresh `authenticate()` call. The
   * provider is also wired up with the requester's logger so its authentication attempts log
   * through the same sink.
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
   * Sends a request using the fetcher and returns the response.
   *
   * Adds the bearer token to the headers and catches errors. JSON `Accept` and `Content-Type`
   * headers are applied unless the caller has already set them (e.g. for multipart uploads).
   * Non-2xx responses are surfaced as thrown `Error`s that include the status code and, when
   * present, the `error` field from the response body.
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
