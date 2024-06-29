import { IRequester } from './IRequester';

/**
 * Parent class for other endpoints.
 */
export default abstract class Endpoint {
  /**
   * Constructor.
   *
   * @param requester The object to use to make requests.
   */
  constructor(protected requester: IRequester) {}
}
