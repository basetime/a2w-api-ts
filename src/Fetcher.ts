/**
 * The type of the fetch() function.
 */
export type Fetcher = (
  input: string | URL | globalThis.Request,
  init?: RequestInit,
) => Promise<Response>;
