import { Logger } from '../Logger';
import { Authed } from '../types/Authed';
import BaseAuthProvider from './BaseAuthProvider';

/**
 * Authenticates with the a2w API using stored id and refresh tokens.
 *
 * Wraps a pre-existing `Authed` value (e.g. one persisted across server restarts).
 * When the cached id token has expired, the shared {@link BaseAuthProvider} machinery
 * will refresh it at `/auth/apiRefresh` using the stored refresh token rather than
 * failing.
 */
export default class StoredProvider extends BaseAuthProvider {
  /**
   * Constructor.
   *
   * @param authed The auth credentials.
   * @param logger The logger to use.
   * @param baseUrl The API base URL to send refresh requests to.
   */
  constructor(authed: Authed, logger?: Logger, baseUrl?: string) {
    super(logger, baseUrl);
    this.authed = authed;
  }

  /**
   * @inheritdoc
   *
   * `StoredProvider` has no grant flow to run — the only way to obtain a fresh token
   * is via the refresh endpoint. When the cached refresh token is rejected, this
   * surfaces as an error.
   */
  protected fetchAuthed = async (): Promise<Authed> => {
    const refreshToken = this.authed?.refreshToken;
    if (!refreshToken) {
      this.logger.error('StoredProvider: No refresh token available');
      throw new Error('StoredProvider: No refresh token available');
    }
    return this.exchangeRefreshToken(refreshToken);
  };
}
