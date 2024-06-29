import { ILogger } from './ILogger';

/**
 * A logger that does nothing.
 */
export default class NoopLogger implements ILogger {
  /**
   * @inheritDoc
   */
  debug(message: string, meta: any): void {
    // Do nothing
  }

  /**
   * @inheritDoc
   */
  info(message: string, meta: any): void {
    // Do nothing
  }

  /**
   * @inheritDoc
   */
  error(message: string, meta: any): void {
    // Do nothing
  }
}
