import { Logger } from '../Logger';
import { Authed } from '../types/Authed';
import BaseAuthProvider, { parseAuthed } from './BaseAuthProvider';

/**
 * Authenticates with the a2w API using an API key and secret.
 *
 * Posts the supplied key/secret pair to `/auth/apiGrant` to obtain an `Authed`. The
 * shared {@link BaseAuthProvider} machinery handles caching, in-flight dedup,
 * clock-skew margin, and refresh-token exchange.
 */
export default class KeysProvider extends BaseAuthProvider {
  /**
   * Constructor.
   *
   * @param key The API key.
   * @param secret The API secret.
   * @param logger The logger to use.
   * @param baseUrl The API base URL to send the grant request to.
   */
  constructor(
    private readonly key: string,
    private readonly secret: string,
    logger?: Logger,
    baseUrl?: string,
  ) {
    super(logger, baseUrl);
  }

  /**
   * @inheritdoc
   */
  protected fetchAuthed = async (): Promise<Authed> => {
    const url = `${this.baseUrl}/auth/apiGrant`;
    this.logger.debug(`Sending request to ${url}`);
    let resp: Response;
    try {
      resp = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: this.key, secret: this.secret }),
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
    return parseAuthed(await resp.json(), '/auth/apiGrant');
  };
}
