import { Requester } from '../types/Requester';

/**
 * Parent class for other endpoints.
 */
export default abstract class Endpoint {
  /**
   * Constructor.
   *
   * @param req The object to use to make requests.
   */
  constructor(protected req: Requester) {}

  /**
   * Makes a GET request.
   *
   * @param url The url to fetch.
   */
  protected doGet = async <T>(url: string, authenticate = true): Promise<T> => {
    return await this.req.fetch<T>(
      url,
      {
        method: 'GET',
      },
      authenticate,
    );
  };

  /**
   * Makes a POST request.
   *
   * @param url The url to fetch.
   * @param body The body to send.
   */
  protected doPost = async <T>(url: string, body: any, authenticate = true): Promise<T> => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };

    return await this.req.fetch<T>(url, options, authenticate);
  };

  /**
   * Makes a DELETE request.
   *
   * @param url The url to fetch.
   */
  protected doDelete = async <T>(url: string, authenticate = true): Promise<T> => {
    return await this.req.fetch<T>(
      url,
      {
        method: 'DELETE',
      },
      authenticate,
    );
  };
}
