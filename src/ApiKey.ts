/**
 * Instance of an API key.
 */
export interface ApiKey {
  /**
   * The ID of the API key.
   */
  id: string;

  /**
   * The user supplied name of the API key.
   */
  name: string;

  /**
   * A random string that is used to authenticate the API key.
   */
  key: string;

  /**
   * A random string that is used to authenticate the API key.
   */
  secret: string;

  /**
   * The ID of the organization the API key belongs to.
   */
  organizationId: string;

  /**
   * Whether this API key belongs to a scanner.
   */
  isScanner?: boolean;

  /**
   * Whether the API key has been deleted.
   */
  isDeleted?: boolean;

  /**
   * The date the API key was created.
   */
  createdDate: Date;
}
