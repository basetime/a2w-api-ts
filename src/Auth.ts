import { ILogger } from './ILogger';

/**
 * Authenticates the with the a2w API.
 */
export default class Auth {
  /**
   * The last id token.
   */
  private idToken?: string;

  /**
   * Constructor.
   *
   * @param key The API key.
   * @param secret The API secret.
   * @param baseUrl The base URL.
   * @param logger The logger to use.
   */
  constructor(
    private readonly key: string,
    private readonly secret: string,
    private readonly baseUrl: string,
    private readonly logger: ILogger,
  ) {}

  /**
   * Retreives an id token from the a2w API.
   *
   * @returns The id token.
   */
  public getBearerToken = async (): Promise<string> => {
    if (this.idToken) {
      return this.idToken;
    }

    const opts: RequestInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: this.key,
        secret: this.secret,
      }),
    };

    this.logger.debug(`Sending request to ${this.baseUrl}/auth/apiGrant`);
    const resp = await fetch(`${this.baseUrl}/auth/apiGrant`, opts).then((r) => r.json());
    this.idToken = resp.idToken;

    return resp.idToken;
  };
}
