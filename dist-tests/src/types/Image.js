"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for an image that can be used on the frontend.
 */
exports.ImageSchema = zod_1.z
    .object({
    /**
     * The name of the image.
     */
    name: zod_1.z.string(),
    /**
     * The URL of the image.
     */
    url: zod_1.z.string(),
    /**
     * The tags associated with the image.
     */
    tags: zod_1.z.array(zod_1.z.string()),
    /**
     * The width of the image.
     */
    width: zod_1.z.number(),
    /**
     * The height of the image.
     */
    height: zod_1.z.number(),
    /**
     * The size of the image in bytes.
     */
    size: zod_1.z.number(),
    /**
     * The mime type of the image.
     */
    mimeType: zod_1.z.string(),
    /**
     * The md5 hash of the image.
     */
    md5: zod_1.z.string(),
    /**
     * The ID of the folder the template belongs to.
     */
    folder: zod_1.z.string(),
})
    .passthrough();
