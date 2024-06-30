import { Authed } from './Authed';
import { Logger } from './Logger';
import NoopLogger from './NoopLogger';

/**
 * Authenticates the with the a2w API.
 *
 * Used to make authentication requests to a2w in order to obtain tokens. The
 * tokens will be used for future requests to the API.
 */
export default class Auth {
  /**
   * The successful last authentication.
   */
  private authed?: Authed;

  /**
   * The logger.
   */
  private logger: Logger;

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
    logger?: Logger,
  ) {
    this.logger = logger || new NoopLogger();
  }

  /**
   * Sets the logger to use.
   *
   * @param logger The logger to use.
   */
  public setLogger = (logger: Logger) => {
    this.logger = logger;
  };

  /**
   * Returns the last authentication.
   *
   * This method is used to retrieve the last successful authentication. In
   * includes the id token, refresh token, and the expiration time.
   *
   * @returns The last authentication.
   */
  public getAuthed = (): Authed | undefined => {
    return this.authed;
  };

  /**
   * Retreives an id token from the a2w API.
   *
   * This method will authenticate with the a2w API and return the id token. It
   * stores the response in the `authed` property. Use the getAuthed method to
   * retrieve the last successful authentication.
   *
   * @returns The id token.
   */
  public authenticate = async (): Promise<string> => {
    if (this.authed && this.authed.expiresAt > Date.now() / 1000) {
      return this.authed.idToken;
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
    this.authed = await fetch(`${this.baseUrl}/auth/apiGrant`, opts)
      .then((resp) => {
        if (resp.ok) {
          return resp.json();
        }

        throw new Error(
          `Authentication returned non-ok response: ${resp.status} ${resp.statusText}`,
        );
      })
      .then((json: Authed) => {
        if (typeof json !== 'object') {
          throw new Error('Invalid object from /auth/apiGrant endpoint.');
        }
        if (typeof json.idToken !== 'string') {
          throw new Error('Invalid idToken from /auth/apiGrant endpoint.');
        }
        if (typeof json.refreshToken !== 'string') {
          throw new Error('Invalid refreshToken from /auth/apiGrant endpoint.');
        }
        if (typeof json.expiresAt !== 'number') {
          throw new Error('Invalid expiresAt from /auth/apiGrant endpoint.');
        }

        return json;
      })
      .catch((err: any) => {
        throw new Error(`Failed to authenticate: ${err.toString()}`);
      });

    return this.authed.idToken;
  };
}
