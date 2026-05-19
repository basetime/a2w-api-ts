/**
 * Error thrown by `HttpRequester` for any non-2xx response from the API.
 *
 * Wraps the HTTP status, status text, the parsed response body (JSON when the response
 * was JSON, raw text otherwise), and the absolute request URL. The `cause` option can
 * carry an underlying error (e.g. a `SyntaxError` from JSON parsing) so callers can walk
 * the chain via `err.cause`.
 *
 * The class exists so consumers can `instanceof ApiError` and read structured fields
 * (`err.status`, `err.body`) instead of regexing the message.
 */
export class ApiError extends Error {
  /**
   * The HTTP status code returned by the API.
   */
  public readonly status: number;

  /**
   * The HTTP status text returned by the API.
   */
  public readonly statusText: string;

  /**
   * The parsed response body. JSON-decoded when the response was JSON, raw string
   * otherwise.
   */
  public readonly body: unknown;

  /**
   * The absolute URL of the failing request (after base URL resolution and
   * `?api=true` injection).
   */
  public readonly url: string;

  /**
   * Constructor.
   *
   * @param status The HTTP status code.
   * @param statusText The HTTP status text.
   * @param body The parsed response body.
   * @param url The absolute URL of the request.
   * @param options Optional `cause` field for chaining underlying errors.
   */
  constructor(
    status: number,
    statusText: string,
    body: unknown,
    url: string,
    options?: { cause?: unknown },
  ) {
    const detail = extractDetail(body) ?? statusText;
    super(`${status} ${detail} (${url})`);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.body = body;
    this.url = url;
    // Assigned after `super(...)` so the constructor signature stays compatible with
    // older `lib` targets that don't yet declare `ErrorOptions` (the second `Error`
    // constructor arg landed in ES2022).
    if (options && 'cause' in options) {
      (this as { cause?: unknown }).cause = options.cause;
    }
  }
}

/**
 * Pulls a human-readable error message out of a JSON body when present.
 *
 * Looks for the common `{ error: '...' }` or `{ message: '...' }` shapes returned by
 * the backend; returns `undefined` when neither is present so the caller can fall back
 * to `statusText`.
 *
 * @param body The parsed response body.
 */
const extractDetail = (body: unknown): string | undefined => {
  if (!body || typeof body !== 'object') {
    if (typeof body === 'string' && body.length > 0) {
      return body;
    }
    return undefined;
  }
  const record = body as Record<string, unknown>;
  if (typeof record.error === 'string') {
    return record.error;
  }
  if (typeof record.message === 'string') {
    return record.message;
  }
  return undefined;
};
