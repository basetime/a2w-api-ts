import { AuthProvider } from './AuthProvider';
import { Authed } from './Authed';
import { Logger } from './Logger';
import NoopLogger from './NoopLogger';
import { getBaseUrl } from './constants';

const e = encodeURIComponent;

/**
 * Authenticates with the a2w API using an oauth code.
 */
export default class OAuthProvider implements AuthProvider {
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
   * @param app The ID of the app requesting authentication.
   * @param code The code that was received from the oauth.
   * @param logger The logger to use.
   */
  constructor(
    private app: string,
    private code = '',
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
   * Returns a URL to get an oauth code.
   *
   * @param redirectUrl The URL to redirect to after the oauth code is received.
   * @param scopes The requested scopes.
   * @param state Any value, it will be returned in the redirect.
   */
  public getCodeUrl = (redirectUrl: string, scopes: string[], state: string): string => {
    this.logger.debug('OAuth.getCodeUrl', { redirectUrl, scopes, state });
    return `${getBaseUrl()}/auth/oauth/code?app=${e(this.app)}&redirectUrl=${e(redirectUrl)}&scope=${e(scopes.join(' '))}&state=${e(state)}`;
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
        app: this.app,
        code: this.code,
      }),
    };

    const baseUrl = getBaseUrl();
    this.logger.debug(`Sending request to ${baseUrl}/auth/oauth/token`);
    this.authed = await fetch(`${baseUrl}/auth/oauth/token`, opts)
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
          throw new Error('Invalid object from /oauth/token endpoint.');
        }
        if (typeof json.idToken !== 'string') {
          throw new Error('Invalid idToken from /oauth/token endpoint.');
        }
        if (typeof json.refreshToken !== 'string') {
          throw new Error('Invalid refreshToken from /oauth/token endpoint.');
        }
        if (typeof json.expiresAt !== 'number') {
          throw new Error('Invalid expiresAt from /oauth/token endpoint.');
        }

        return json;
      })
      .catch((err: any) => {
        throw new Error(`Failed to authenticate: ${err.toString()}`);
      });

    return this.authed.idToken;
  };
}
