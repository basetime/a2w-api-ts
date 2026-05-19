import { z } from 'zod';

/**
 * Schema for a scanner invite.
 *
 * A scanner invite is a jwt that is used to authenticate with a scanner.
 */
export const ScannerInviteSchema = z
  .object({
    /**
     * The ID of the scanner invite.
     */
    id: z.string(),

    /**
     * The organization the scanner invite belongs to.
     */
    organization: z.string(),

    /**
     * The invite code.
     */
    secret: z.string(),

    /**
     * The security code used to verify the scanner.
     */
    verificationCode: z.string(),

    /**
     * Has the invite been claimed?
     */
    isClaimed: z.boolean(),

    /**
     * The base url for the api.
     */
    baseUrl: z.string(),

    /**
     * The pin number used to verify the scanner.
     */
    pin: z.string(),

    /**
     * The brand color.
     */
    brandColor: z.string(),

    /**
     * The brand logo url.
     */
    brandLogoUrl: z.string(),

    /**
     * Whether or not to show the scanner button.
     */
    hideScanButton: z.boolean(),

    /**
     * The webview jwt.
     */
    webviewJwt: z.string(),

    /**
     * The scan webview url.
     */
    webviewUrl: z.string(),

    /**
     * The standby webview url.
     */
    standbyUrl: z.string(),

    /**
     * The date the invite was created.
     */
    createdDate: z.coerce.date(),
  })
  .passthrough();

/**
 * A scanner invite is a jwt that is used to authenticate with a scanner.
 */
export type ScannerInvite = z.infer<typeof ScannerInviteSchema>;
