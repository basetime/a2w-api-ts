import { z } from 'zod';

/**
 * Schema for an OAuth token response from `/auth/oauth/token`.
 */
export const OAuthTokenSchema = z
  .object({
    access_token: z.string(),
    refresh_token: z.string(),
    expires_at: z.number(),
  })
  .passthrough();

/**
 * Schema for an auth response from `/auth/apiGrant` and `/auth/apiRefresh`.
 */
export const AuthedSchema = z
  .object({
    /**
     * The ID token used as the bearer token on subsequent API requests.
     */
    idToken: z.string(),

    /**
     * The refresh token used to obtain a fresh `idToken` without re-running the
     * full grant flow.
     */
    refreshToken: z.string(),

    /**
     * Unix timestamp (in seconds) at which `idToken` expires.
     */
    expiresAt: z.number(),
  })
  .passthrough();

/**
 * A response from the a2w auth endpoints.
 */
export type Authed = z.infer<typeof AuthedSchema>;
