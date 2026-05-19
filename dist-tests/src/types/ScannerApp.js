"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScannerAppSchema = void 0;
const zod_1 = require("zod");
const Attributes_1 = require("./Attributes");
/**
 * Schema for a scanner app.
 */
exports.ScannerAppSchema = zod_1.z
    .object({
    /**
     * The ID of the scanner app.
     */
    id: zod_1.z.string(),
    /**
     * The name of the scanner app.
     */
    name: zod_1.z.string(),
    /**
     * Description of the app.
     */
    description: zod_1.z.string(),
    /**
     * The registration code.
     */
    registrationCode: zod_1.z.string(),
    /**
     * The ID of the organization or '0' for a global template.
     */
    organizationId: zod_1.z.string(),
    /**
     * The ID of the global template when applicable, or else '0'.
     */
    parentId: zod_1.z.string(),
    /**
     * The tags associated with the scanner app.
     */
    tags: zod_1.z.array(zod_1.z.string()),
    /**
     * The ID of the attributes or the entity.
     */
    attributes: Attributes_1.AttributesSchema,
    /**
     * The URL of the webview shown when a pass is scanned.
     */
    webviewScanUrl: zod_1.z.string(),
    /**
     * The URL of the webview shown when the scanner is in standby mode.
     */
    webviewStandbyUrl: zod_1.z.string(),
    /**
     * The URL of the webview shown when an error occurs.
     */
    webviewErrorUrl: zod_1.z.string(),
    /**
     * The password for the webview.
     */
    webviewPassword: zod_1.z.string(),
    /**
     * The passcode to enter the scanner settings screen.
     */
    passCode: zod_1.z.string().optional(),
    /**
     * The brand color to use on the scanner screen.
     */
    brandColor: zod_1.z.string().optional(),
    /**
     * The URL for the brand logo to use on the scanner screen.
     */
    brandLogoUrl: zod_1.z.string().optional(),
    /**
     * Is the scanner in kiosk mode?
     */
    isKioskMode: zod_1.z.boolean().optional(),
    /**
     * Is the scanner configured via JSON?
     */
    isJsonConfigured: zod_1.z.boolean().optional(),
    /**
     * The JSON configuration for the scanner.
     */
    jsonConfig: zod_1.z.string().optional(),
    /**
     * The URL of the JSON configuration for the scanner.
     */
    jsonConfigUrl: zod_1.z.string().optional(),
    /**
     * The number of scanners that have been registered.
     */
    scannerCount: zod_1.z.number(),
    /**
     * Additional scanner app settings.
     */
    settings: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
})
    .passthrough();
