import { z } from 'zod';

/**
 * Schema for the details of a claimed pass.
 */
export const ClaimSchema = z
  .object({
    /**
     * The ID of the log.
     */
    id: z.string(),

    /**
     * The visitor's IP address.
     */
    ip: z.string(),

    /**
     * The user agent string.
     */
    ua: z.string(),

    /**
     * The URI the visitor requested.
     */
    uri: z.string(),

    /**
     * The number of bytes in the response.
     */
    bytes: z.number(),

    /**
     * The visitor's country.
     */
    country: z.string(),

    /**
     * The visitor's state.
     */
    state: z.string(),

    /**
     * The visitor's zip code.
     */
    zip: z.string(),

    /**
     * The browser referrer.
     */
    referrer: z.string(),

    /**
     * The visitor's latitude.
     */
    latitude: z.number(),

    /**
     * The visitor's longitude.
     */
    longitude: z.number(),

    /**
     * The query values passed to the requested page.
     */
    query: z.record(z.string(), z.string()),

    /**
     * The ID of the pass that was used.
     */
    pass: z.string(),

    /**
     * The template ID.
     */
    templateId: z.string(),

    /**
     * The template version.
     */
    templateVersion: z.number(),

    /**
     * The ID of the enrollment if applicable.
     */
    enrollmentId: z.string(),

    /**
     * The pass primary key value.
     */
    primaryKey: z.string(),

    /**
     * The ID of the campaign.
     */
    campaign: z.string(),

    /**
     * Was this a mobile request?
     */
    isMobile: z.boolean(),

    /**
     * Was this a tablet request?
     */
    isTablet: z.boolean(),

    /**
     * Was this a desktop request?
     */
    isDesktop: z.boolean(),

    /**
     * Was this a wearable request?
     */
    isWearable: z.boolean(),

    /**
     * Was this a Mac request?
     */
    isMacType: z.boolean(),

    /**
     * Was this a Windows request?
     */
    isWindowsType: z.boolean(),

    /**
     * Was this a Windows Phone request?
     */
    isWinPhoneType: z.boolean(),

    /**
     * Was this an iOS request?
     */
    isIOSType: z.boolean(),

    /**
     * Was this an Android request?
     */
    isAndroidType: z.boolean(),

    /**
     * Was this a Linux request?
     */
    isLinuxType: z.boolean(),

    /**
     * Information about the browser.
     */
    browser: z
      .object({
        name: z.string(),
        version: z.string(),
        major: z.string(),
      })
      .passthrough(),

    /**
     * Information about the operating system.
     */
    os: z
      .object({
        name: z.string(),
        version: z.string(),
      })
      .passthrough(),

    /**
     * Was the pass installed?
     */
    installed: z.boolean(),

    /**
     * Was the pass enrolled?
     */
    enrolled: z.boolean(),

    /**
     * Was the pass pushed?
     */
    pushed: z.boolean(),

    /**
     * Was the pass deleted?
     */
    deleted: z.boolean(),

    /**
     * The date the pass was deleted from the user's wallet.
     *
     * If the pass is still in the user's wallet, this will be null.
     */
    deletedDate: z.coerce.date().nullable(),

    /**
     * The date the pass was updated in the user's wallet.
     *
     * If the pass has not been updated, this will be null.
     */
    updatedDate: z.coerce.date().nullable(),
  })
  .passthrough();

/**
 * The details of a claimed pass.
 */
export type Claim = z.infer<typeof ClaimSchema>;
