"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScannerInviteSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for a scanner invite.
 *
 * A scanner invite is a jwt that is used to authenticate with a scanner.
 */
exports.ScannerInviteSchema = zod_1.z
    .object({
    /**
     * The ID of the scanner invite.
     */
    id: zod_1.z.string(),
    /**
     * The organization the scanner invite belongs to.
     */
    organization: zod_1.z.string(),
    /**
     * The invite code.
     */
    secret: zod_1.z.string(),
    /**
     * The security code used to verify the scanner.
     */
    verificationCode: zod_1.z.string(),
    /**
     * Has the invite been claimed?
     */
    isClaimed: zod_1.z.boolean(),
    /**
     * The base url for the api.
     */
    baseUrl: zod_1.z.string(),
    /**
     * The pin number used to verify the scanner.
     */
    pin: zod_1.z.string(),
    /**
     * The brand color.
     */
    brandColor: zod_1.z.string(),
    /**
     * The brand logo url.
     */
    brandLogoUrl: zod_1.z.string(),
    /**
     * Whether or not to show the scanner button.
     */
    hideScanButton: zod_1.z.boolean(),
    /**
     * The webview jwt.
     */
    webviewJwt: zod_1.z.string(),
    /**
     * The scan webview url.
     */
    webviewUrl: zod_1.z.string(),
    /**
     * The standby webview url.
     */
    standbyUrl: zod_1.z.string(),
    /**
     * The date the invite was created.
     */
    createdDate: zod_1.z.coerce.date(),
})
    .passthrough();
