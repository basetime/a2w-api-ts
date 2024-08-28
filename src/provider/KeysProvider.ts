import { Logger } from '../Logger';
import NoopLogger from '../NoopLogger';
import { getBaseUrl } from '../constants';
import { Authed } from '../types/Authed';
import { AuthProvider } from './AuthProvider';

/**
 * Authenticates the with the a2w API using an API key and secret.
 *
 * Used to make authentication requests to a2w in order to obtain tokens. The
 * tokens will be used for future requests to the API.
 */
export default class KeysProvider implements AuthProvider {
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
   * @param logger The logger to use.
   */
  constructor(
    private readonly key: string,
    private readonly secret: string,
    logger?: Logger,
  ) {
    this.logger = logger || new NoopLogger();
  }

  /**
   * @inheritdoc
   */
  public setLogger = (logger: Logger) => {
    this.logger = logger;
  };

  /**
   * @inheritdoc
   */
  public getAuthed = (): Authed | undefined => {
    return this.authed;
  };

  /**
   * @inheritdoc
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

    const baseUrl = getBaseUrl();
    this.logger.debug(`Sending request to ${baseUrl}/auth/apiGrant`);
    this.authed = await fetch(`${baseUrl}/auth/apiGrant`, opts)
      .then(async (resp) => {
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
