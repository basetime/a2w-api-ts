import { Requester } from '../http/Requester';

/**
 * Parent class for other endpoints.
 *
 * Provides a stable, protected request surface (`doGet`/`doPost`/`doPut`/`doDelete`) for
 * subclasses to call. The actual HTTP work is delegated to the injected `Requester`, which keeps
 * subclasses free of any direct dependency on `HttpRequester` and trivially testable with a
 * stub requester.
 */
export default abstract class Endpoint {
  /**
   * Constructor.
   *
   * The requester is typically the shared `HttpRequester` owned by the parent `Client`, but
   * tests may pass any object that satisfies the `Requester` interface.
   *
   * @param req The object to use to make requests.
   */
  constructor(protected req: Requester) { }

  /**
   * Makes a GET request.
   *
   * Forwards to the injected `Requester`. Provided so subclasses don't have to reach through
   * `this.req` for the common case.
   *
   * @param url The url to fetch.
   * @param authenticate Whether to authenticate the request.
   */
  protected doGet = async <T>(url: string, authenticate = true): Promise<T> => {
    return await this.req.doGet<T>(url, authenticate);
  };

  /**
   * Makes a POST request.
   *
   * Forwards to the injected `Requester`, which handles JSON serialisation and headers.
   *
   * @param url The url to fetch.
   * @param body The body to send.
   * @param authenticate Whether to authenticate the request.
   */
  protected doPost = async <T>(url: string, body: any, authenticate = true): Promise<T> => {
    return await this.req.doPost<T>(url, body, authenticate);
  };

  /**
   * Makes a PUT request.
   *
   * Forwards to the injected `Requester`, which handles JSON serialisation and headers.
   *
   * @param url The url to fetch.
   * @param body The body to send.
   * @param authenticate Whether to authenticate the request.
   */
  protected doPut = async <T>(url: string, body: any, authenticate = true): Promise<T> => {
    return await this.req.doPut<T>(url, body, authenticate);
  };

  /**
   * Makes a DELETE request.
   *
   * Forwards to the injected `Requester`. The body is optional; when supplied it is sent as
   * JSON, otherwise the request goes out without one.
   *
   * @param url The url to fetch.
   * @param authenticate Whether to authenticate the request.
   * @param body The body to send.
   */
  protected doDelete = async <T>(url: string, authenticate = true, body: any = undefined): Promise<T> => {
    return await this.req.doDelete<T>(url, authenticate, body);
  };
}
