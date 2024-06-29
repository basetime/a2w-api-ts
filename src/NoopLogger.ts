import { Logger } from './Logger';

/**
 * A logger that does nothing.
 */
export default class NoopLogger implements Logger {
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
