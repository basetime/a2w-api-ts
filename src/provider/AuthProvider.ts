import { Logger } from '../Logger';
import { Authed } from '../types/Authed';

/**
 * Authenticates with the a2w API.
 */
export interface AuthProvider {
  /**
   * Sets the logger to use.
   *
   * @param logger The logger to set.
   */
  setLogger: (logger: Logger) => void;

  /**
   * Sets the API base URL the provider should use for its own auth requests.
   *
   * Called by `HttpRequester.setAuth(...)` so the provider's `/auth/apiGrant`,
   * `/auth/oauth/token`, and `/auth/apiRefresh` requests automatically target the same
   * origin as the requester. Providers may also accept this via their constructor.
   *
   * @param baseUrl The API base URL to use.
   */
  setBaseUrl: (baseUrl: string) => void;

  /**
   * Returns the last authentication.
   */
  getAuthed: () => Authed | undefined;

  /**
   * Authenticates with the a2w API and returns the id token.
   *
   * Implementations cache the resulting `Authed` and reuse it until expiry (with a small
   * clock-skew margin), and dedupe concurrent calls to avoid stampeding the auth
   * endpoint when many requests fire in parallel.
   */
  authenticate: () => Promise<string>;

  /**
   * Exchanges the cached refresh token for a fresh id token via `/auth/apiRefresh`.
   *
   * Used by `HttpRequester` to recover from a 401 mid-request without re-running the
   * full grant flow. Implementations should fall back to `authenticate()` when no
   * refresh token is available, the refresh endpoint rejects the token, or the
   * provider's grant model doesn't support refresh (e.g. one-shot OAuth code).
   */
  refresh: () => Promise<string>;
}
