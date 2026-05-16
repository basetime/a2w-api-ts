/**
 * A chainable URL builder returned by {@link QueryBuilder.create}.
 *
 * Holds a path template that may contain `{name}` placeholders, plus a bag of placeholder
 * values and an ordered list of query parameters. Call {@link toString} to interpolate the
 * placeholders (URL-encoded) and append the query string.
 *
 * Instances are mutable; the fluent methods return `this` so calls can be chained.
 */
export class UrlBuilder {
  /**
   * Values for `{name}` placeholders in the path template, set via {@link addParam}.
   */
  private params = new Map<string, string>();

  /**
   * Ordered list of query parameters set via {@link addQuery}. Order is preserved and
   * duplicate keys are permitted so callers can build `key=a&key=b` style strings.
   */
  private queries: [string, string][] = [];

  /**
   * Constructor.
   *
   * @param template The raw path template, e.g. `/campaigns/{id}/passes`. Anything between
   *   `{` and `}` is treated as a placeholder name that must be supplied via {@link addParam}
   *   before {@link toString} is called.
   */
  constructor(private template: string) { }

  /**
   * Records a value for a `{name}` placeholder in the path template.
   *
   * Values are coerced to string and URL-encoded at {@link toString} time, not now, so
   * later overrides win.
   *
   * @param key The placeholder name (without braces).
   * @param value The value to substitute.
   */
  public addParam = (key: string, value: string | number | boolean): this => {
    this.params.set(key, String(value));
    return this;
  };

  /**
   * Appends a query parameter.
   *
   * Order of calls is preserved in the generated query string. Duplicate keys are allowed
   * and emitted as repeated `key=value` pairs.
   *
   * @param key The query parameter name.
   * @param value The query parameter value.
   */
  public addQuery = (key: string, value: string | number | boolean): this => {
    this.queries.push([key, String(value)]);
    return this;
  };

  /**
   * Renders the final URL.
   *
   * Replaces every `{name}` placeholder with its URL-encoded value, then appends the
   * collected query parameters as a `?k=v&...` suffix when any are present.
   *
   * @throws Error If the template references a placeholder that was never supplied via
   *   {@link addParam}.
   */
  public toString = (): string => {
    const path = this.template.replace(/\{(\w+)\}/g, (_match, key: string) => {
      const value = this.params.get(key);
      if (value === undefined) {
        throw new Error(`QueryBuilder: missing value for placeholder '{${key}}' in template '${this.template}'`);
      }
      return encodeURIComponent(value);
    });

    if (this.queries.length === 0) {
      return path;
    }

    const qs = this.queries
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    return `${path}?${qs}`;
  };
}

/**
 * A per-endpoint factory that produces {@link UrlBuilder} instances rooted at a common
 * base URL plus endpoint path.
 *
 * Inside the SDK this is constructed by {@link Endpoint} with an empty `baseUrl` so that
 * {@link UrlBuilder.toString} returns a relative path; the parent `HttpRequester` then
 * prepends the configured API origin. Callers using `QueryBuilder` directly may pass a
 * real base URL to get a fully-qualified URL back.
 */
export class QueryBuilder {
  /**
   * Constructor.
   *
   * @param baseUrl The base URL prepended to every produced URL. Pass `''` to produce a
   *   relative path (the default mode used by the SDK's `Endpoint` base class).
   * @param endpointPath The endpoint path appended after the base URL, e.g. `/campaigns`.
   */
  constructor(private baseUrl: string, private endpointPath: string) { }

  /**
   * Creates a new {@link UrlBuilder} for a path under the endpoint.
   *
   * The supplied `path` is appended verbatim to `${baseUrl}${endpointPath}` and may
   * contain `{name}` placeholders that are filled in via {@link UrlBuilder.addParam}.
   *
   * @param path The path fragment beneath the endpoint root, e.g. `/{id}/passes`. Defaults
   *   to an empty string, which targets the endpoint root itself.
   */
  public create = (path: string = ''): UrlBuilder => {
    return new UrlBuilder(`${this.baseUrl}${this.endpointPath}${path}`);
  };
}
