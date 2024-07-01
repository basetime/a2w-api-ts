/**
 * Represents a class that can make HTTP requests to the a2w API.
 */
export interface Requester {
  /**
   * Sends a request using the fetcher and returns the response.
   *
   * Adds the bearer token to the headers and catches errors.
   *
   * @param url The url to send the request to.
   * @param options The fetch options.
   * @returns {T} The response from the endpoint.
   */
  fetch: <T>(url: string, options: RequestInit) => Promise<T>;
}
