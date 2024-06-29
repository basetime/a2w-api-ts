/**
 * Represents a type that logs messages.
 */
export interface ILogger {
  /**
   * Log a message.
   *
   * @param message The message to log.
   * @param meta The metadata to log.
   */
  debug(message: string, meta?: any): void;

  /**
   * Log a message.
   *
   * @param message The message to log.
   * @param meta The metadata to log.
   */
  info(message: string, meta?: any): void;

  /**
   * Log a message.
   *
   * @param message The message to log.
   * @param meta The metadata to log.
   */
  error(message: string, meta?: any): void;
}
