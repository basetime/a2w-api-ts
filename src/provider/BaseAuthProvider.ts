import { DEFAULT_BASE_URL } from '../constants';
import { Logger } from '../Logger';
import NoopLogger from '../NoopLogger';
import { AuthedSchema, Authed } from '../types/Authed';
import { AuthProvider } from './AuthProvider';

/**
 * Seconds of clock-skew margin applied to cached token expiry.
 *
 * A cached `Authed` is treated as expired this many seconds before its real
 * `expiresAt`, so we trigger a refresh before the token actually expires mid-request.
 */
export const TOKEN_SKEW_SECONDS = 30;

/**
 * Abstract base class shared by every {@link AuthProvider} implementation in the SDK.
 *
 * Centralises three concerns that every provider needs and that are easy to get wrong:
 *
 * 1. **In-flight dedup.** When many parallel requests arrive without a cached token,
 *    only one network round-trip fires; the rest await the same promise.
 * 2. **Clock-skew margin.** Cached tokens are considered expired
 *    {@link TOKEN_SKEW_SECONDS} seconds early so we never send a doomed request.
 * 3. **Real refresh-token support.** `refresh()` exchanges the cached refresh token at
 *    `/auth/apiRefresh` and falls back to a fresh grant on failure.
 *
 * Subclasses only have to implement {@link fetchAuthed}, which performs the
 * provider-specific initial grant (key/secret, oauth code, ...).
 */
export default abstract class BaseAuthProvider implements AuthProvider {
  /**
   * The last successful authentication.
   */
  protected authed?: Authed;

  /**
   * Promise of an in-flight `fetchAuthed()` call, used to dedupe concurrent
   * `authenticate()` invocations. Cleared in a `finally` after the request settles.
   */
  protected pendingAuth?: Promise<Authed>;

  /**
   * Promise of an in-flight `refresh()` call, used to dedupe concurrent
   * `refresh()` invocations.
   */
  protected pendingRefresh?: Promise<Authed>;

  /**
   * The logger.
   */
  protected logger: Logger;

  /**
   * The API base URL used for auth requests.
   */
  protected baseUrl: string;

  /**
   * Constructor.
   *
   * @param logger The logger to use.
   * @param baseUrl The API base URL to send auth requests to.
   */
  constructor(logger?: Logger, baseUrl: string = DEFAULT_BASE_URL) {
    this.logger = logger || new NoopLogger();
    this.baseUrl = baseUrl;
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
  public setBaseUrl = (baseUrl: string) => {
    this.baseUrl = baseUrl;
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
    if (this.isTokenFresh()) {
      return this.authed!.idToken;
    }
    if (this.pendingAuth) {
      const cached = await this.pendingAuth;
      return cached.idToken;
    }
    this.pendingAuth = this.fetchAuthed()
      .then((authed) => {
        this.authed = authed;
        return authed;
      })
      .finally(() => {
        this.pendingAuth = undefined;
      });
    const authed = await this.pendingAuth;
    return authed.idToken;
  };

  /**
   * @inheritdoc
   */
  public refresh = async (): Promise<string> => {
    if (this.pendingRefresh) {
      const cached = await this.pendingRefresh;
      return cached.idToken;
    }
    const refreshToken = this.authed?.refreshToken;
    if (!refreshToken) {
      return this.authenticate();
    }
    this.pendingRefresh = this.exchangeRefreshToken(refreshToken)
      .then((authed) => {
        this.authed = authed;
        return authed;
      })
      .catch(async (err) => {
        this.logger.debug(`Refresh failed, falling back to full grant: ${err}`);
        const grantToken = await this.authenticate();
        return { idToken: grantToken, refreshToken, expiresAt: this.authed?.expiresAt ?? 0 };
      })
      .finally(() => {
        this.pendingRefresh = undefined;
      });
    const authed = await this.pendingRefresh;
    return authed.idToken;
  };

  /**
   * Returns whether the cached `Authed` is still usable.
   *
   * A token is considered fresh when it exists and its `expiresAt` is more than
   * {@link TOKEN_SKEW_SECONDS} seconds in the future.
   */
  protected isTokenFresh = (): boolean => {
    if (!this.authed) {
      return false;
    }
    const now = Date.now() / 1000;
    return this.authed.expiresAt > now + TOKEN_SKEW_SECONDS;
  };

  /**
   * Exchanges a refresh token at `/auth/apiRefresh` for a fresh `Authed`.
   *
   * @param refreshToken The cached refresh token.
   */
  protected exchangeRefreshToken = async (refreshToken: string): Promise<Authed> => {
    const url = `${this.baseUrl}/auth/apiRefresh`;
    this.logger.debug(`Refreshing token at ${url}`);
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
    if (!resp.ok) {
      throw new Error(`Refresh returned non-ok response: ${resp.status} ${resp.statusText}`);
    }
    return parseAuthed(await resp.json(), '/auth/apiRefresh');
  };

  /**
   * Performs the provider-specific initial grant.
   *
   * Subclasses POST their credentials to the appropriate `/auth/*` endpoint and return
   * the parsed `Authed` value. The base class handles caching, dedup, and refresh.
   */
  protected abstract fetchAuthed(): Promise<Authed>;
}

/**
 * Parses an auth response into an `Authed`, throwing a descriptive error on failure.
 *
 * Used by both {@link BaseAuthProvider.exchangeRefreshToken} and subclass
 * `fetchAuthed()` implementations to avoid duplicating the hand-rolled shape check.
 *
 * @param raw The raw response body.
 * @param endpoint The endpoint path (used in error messages).
 */
export const parseAuthed = (raw: unknown, endpoint: string): Authed => {
  const parsed = AuthedSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`Invalid response from ${endpoint} endpoint: ${parsed.error.message}`);
  }
  return parsed.data;
};
