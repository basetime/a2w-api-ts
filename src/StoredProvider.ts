import { AuthProvider } from './AuthProvider';
import { Authed } from './Authed';
import { Logger } from './Logger';
import NoopLogger from './NoopLogger';

/**
 * Authenticates the with the a2w API using stored id and refresh tokens.
 */
export default class StoredProvider implements AuthProvider {
  /**
   * The logger.
   */
  private logger: Logger;

  /**
   * Constructor.
   *
   * @param authed The auth credentials.
   * @param logger The logger to use.
   */
  constructor(
    private readonly authed: Authed,
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

    this.logger.error('StoredProvider: No valid authed found');
    throw new Error('StoredProvider: No valid authed found');
  };
}
