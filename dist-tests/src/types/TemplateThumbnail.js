"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateThumbnailSchema = void 0;
const zod_1 = require("zod");
const Template_1 = require("./Template");
/**
 * Schema for the details needed to render a template thumbnail.
 */
exports.TemplateThumbnailSchema = zod_1.z
    .object({
    /**
     * The ID of the template.
     */
    id: zod_1.z.string(),
    /**
     * The name of the template.
     */
    name: zod_1.z.string(),
    /**
     * The version of the template.
     */
    version: zod_1.z.number(),
    /**
     * URL of the png thumbnail for the template.
     */
    thumbnail: zod_1.z.string(),
    /**
     * The description of the template.
     */
    description: zod_1.z.string(),
    /**
     * The attributes of the template.
     */
    attributes: Template_1.TemplateAttributesSchema,
    /**
     * The logo text for the template.
     */
    logoText: zod_1.z.string(),
    /**
     * Primary text for the template.
     */
    primaryText: zod_1.z.string(),
    /**
     * Header text for the template.
     */
    headerText: zod_1.z.string(),
    /**
     * Secondary text for the template.
     */
    secondaryText: zod_1.z.string(),
    /**
     * The logo URL for the template.
     */
    logo: zod_1.z.string(),
    /**
     * The banner URL for the template.
     */
    banner: zod_1.z.string(),
    /**
     * The background color of the template.
     */
    backgroundColor: zod_1.z.string(),
    /**
     * The foreground color of the template.
     */
    foregroundColor: zod_1.z.string(),
    /**
     * The URL of the screenshot for the template.
     */
    screenshotUrl: zod_1.z.string().optional(),
    /**
     * The URL of the Apple screenshot for the template.
     */
    screenshotAppleUrl: zod_1.z.string().optional(),
    /**
     * The URL of the Android screenshot for the template.
     */
    screenshotAndroidUrl: zod_1.z.string().optional(),
    /**
     * The date the template was created.
     */
    createdDate: zod_1.z.coerce.date(),
})
    .passthrough();
