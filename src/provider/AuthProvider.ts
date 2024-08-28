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
   * Returns the last authentication.
   */
  getAuthed: () => Authed | undefined;

  /**
   * Authenticates with the a2w API and return the id token.
   */
  authenticate: () => Promise<string>;
}
