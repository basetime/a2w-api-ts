import { Requester } from './Requester';

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
}
