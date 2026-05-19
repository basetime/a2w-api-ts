"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaimSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for the details of a claimed pass.
 */
exports.ClaimSchema = zod_1.z
    .object({
    /**
     * The ID of the log.
     */
    id: zod_1.z.string(),
    /**
     * The visitor's IP address.
     */
    ip: zod_1.z.string(),
    /**
     * The user agent string.
     */
    ua: zod_1.z.string(),
    /**
     * The URI the visitor requested.
     */
    uri: zod_1.z.string(),
    /**
     * The number of bytes in the response.
     */
    bytes: zod_1.z.number(),
    /**
     * The visitor's country.
     */
    country: zod_1.z.string(),
    /**
     * The visitor's state.
     */
    state: zod_1.z.string(),
    /**
     * The visitor's zip code.
     */
    zip: zod_1.z.string(),
    /**
     * The browser referrer.
     */
    referrer: zod_1.z.string(),
    /**
     * The visitor's latitude.
     */
    latitude: zod_1.z.number(),
    /**
     * The visitor's longitude.
     */
    longitude: zod_1.z.number(),
    /**
     * The query values passed to the requested page.
     */
    query: zod_1.z.record(zod_1.z.string(), zod_1.z.string()),
    /**
     * The ID of the pass that was used.
     */
    pass: zod_1.z.string(),
    /**
     * The template ID.
     */
    templateId: zod_1.z.string(),
    /**
     * The template version.
     */
    templateVersion: zod_1.z.number(),
    /**
     * The ID of the enrollment if applicable.
     */
    enrollmentId: zod_1.z.string(),
    /**
     * The pass primary key value.
     */
    primaryKey: zod_1.z.string(),
    /**
     * The ID of the campaign.
     */
    campaign: zod_1.z.string(),
    /**
     * Was this a mobile request?
     */
    isMobile: zod_1.z.boolean(),
    /**
     * Was this a tablet request?
     */
    isTablet: zod_1.z.boolean(),
    /**
     * Was this a desktop request?
     */
    isDesktop: zod_1.z.boolean(),
    /**
     * Was this a wearable request?
     */
    isWearable: zod_1.z.boolean(),
    /**
     * Was this a Mac request?
     */
    isMacType: zod_1.z.boolean(),
    /**
     * Was this a Windows request?
     */
    isWindowsType: zod_1.z.boolean(),
    /**
     * Was this a Windows Phone request?
     */
    isWinPhoneType: zod_1.z.boolean(),
    /**
     * Was this an iOS request?
     */
    isIOSType: zod_1.z.boolean(),
    /**
     * Was this an Android request?
     */
    isAndroidType: zod_1.z.boolean(),
    /**
     * Was this a Linux request?
     */
    isLinuxType: zod_1.z.boolean(),
    /**
     * Information about the browser.
     */
    browser: zod_1.z
        .object({
        name: zod_1.z.string(),
        version: zod_1.z.string(),
        major: zod_1.z.string(),
    })
        .passthrough(),
    /**
     * Information about the operating system.
     */
    os: zod_1.z
        .object({
        name: zod_1.z.string(),
        version: zod_1.z.string(),
    })
        .passthrough(),
    /**
     * Was the pass installed?
     */
    installed: zod_1.z.boolean(),
    /**
     * Was the pass enrolled?
     */
    enrolled: zod_1.z.boolean(),
    /**
     * Was the pass pushed?
     */
    pushed: zod_1.z.boolean(),
    /**
     * Was the pass deleted?
     */
    deleted: zod_1.z.boolean(),
    /**
     * The date the pass was deleted from the user's wallet.
     *
     * If the pass is still in the user's wallet, this will be null.
     */
    deletedDate: zod_1.z.coerce.date().nullable(),
    /**
     * The date the pass was updated in the user's wallet.
     *
     * If the pass has not been updated, this will be null.
     */
    updatedDate: zod_1.z.coerce.date().nullable(),
})
    .passthrough();
