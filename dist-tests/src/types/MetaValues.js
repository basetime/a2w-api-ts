"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaValuesSchema = exports.MetaValueSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for the meta value keys.
 */
exports.MetaValueSchema = zod_1.z.enum([
    'bundle',
    'banner',
    'logo',
    'thumbnail',
    'backgroundColor',
    'foregroundColor',
    'labelColor',
    'barcodeFormat',
]);
/**
 * Schema for the meta values that can be set in the query parameters.
 */
exports.MetaValuesSchema = zod_1.z
    .object({
    bundle: zod_1.z.string().optional(),
    banner: zod_1.z.string().optional(),
    logo: zod_1.z.string().optional(),
    thumbnail: zod_1.z.string().optional(),
    backgroundColor: zod_1.z.string().optional(),
    foregroundColor: zod_1.z.string().optional(),
    labelColor: zod_1.z.string().optional(),
    barcodeFormat: zod_1.z.string().optional(),
})
    .passthrough();
