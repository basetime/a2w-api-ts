import Auth from '@/Auth';

/**
 * Parent class for other endpoints.
 */
export default abstract class Endpoint {
  /**
   * Constructor.
   *
   * @param auth The authentication object.
   */
  constructor(private auth: Auth) {}

  /**
   * Retreives a bearer token from the a2w API.
   *
   * @returns {Promise<string>} The bearer token.
   */
  public getBearerToken = async (): Promise<string> => {
    return this.auth.getBearerToken();
  };
}
