/**
 * A response from the a2w auth endpoints.
 */
export interface Authed {
  /**
   * The ID token.
   */
  idToken: string;

  /**
   * The refresh token.
   */
  refreshToken: string;

  /**
   * The expiration time of the token.
   */
  expiresAt: number;
}
