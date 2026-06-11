import { Logger } from '../Logger';
import { Authed, OAuthTokenSchema } from '../types/Authed';
import BaseAuthProvider from './BaseAuthProvider';

const e = encodeURIComponent;

/**
 * Authenticates with the a2w API using an oauth code.
 *
 * The initial grant exchanges the supplied `code` at `/auth/oauth/token`. The shared
 * {@link BaseAuthProvider} machinery handles caching, in-flight dedup, clock-skew
 * margin, and refresh-token exchange via `/auth/apiRefresh` — so an expired token is
 * refreshed without re-spending the original (one-shot) code.
 */
export default class OAuthProvider extends BaseAuthProvider {
  /**
   * Constructor.
   *
   * @param app The OAuth app's client ID.
   * @param code The code that was received from the oauth.
   * @param logger The logger to use.
   * @param baseUrl The API base URL to send the grant request to.
   */
  constructor(
    private app: string,
    private code = '',
    logger?: Logger,
    baseUrl?: string,
  ) {
    super(logger, baseUrl);
  }

  /**
   * Returns a URL to get an oauth code.
   *
   * @param redirectUrl The URL to redirect to after the oauth code is received.
   * @param scopes The requested scopes.
   * @param state Any value, it will be returned in the redirect.
   */
  public getCodeUrl = (redirectUrl: string, scopes: string[], state: string): string => {
    this.logger.debug('OAuth.getCodeUrl', { redirectUrl, scopes, state });
    return `${this.baseUrl}/auth/oauth/code?client_id=${e(this.app)}&redirect_uri=${e(redirectUrl)}&scope=${e(scopes.join(' '))}&state=${e(state)}`;
  };

  /**
   * @inheritdoc
   */
  protected fetchAuthed = async (): Promise<Authed> => {
    const url = `${this.baseUrl}/auth/oauth/token`;
    this.logger.debug(`Sending request to ${url}`);

    let resp: Response;
    try {
      resp = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ client_id: this.app, code: this.code }),
      });
    } catch (err) {
      const wrapped = new Error(`Failed to authenticate: ${(err as Error).message ?? err}`);
      (wrapped as { cause?: unknown }).cause = err;
      throw wrapped;
    }

    if (!resp.ok) {
      throw new Error(
        `Authentication returned non-ok response: ${resp.status} ${resp.statusText}`,
      );
    }

    const parsed = OAuthTokenSchema.safeParse(await resp.json());
    if (!parsed.success) {
      throw new Error(
        `Invalid response from /auth/oauth/token endpoint: ${parsed.error.message}`,
      );
    }

    const { access_token, refresh_token, expires_at } = parsed.data;
    return {
      idToken: access_token,
      refreshToken: refresh_token,
      expiresAt: expires_at,
    };
  };
}
