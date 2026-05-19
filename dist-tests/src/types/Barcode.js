"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarcodeRenderInputSchema = exports.BarcodeTypeSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for the barcode types supported by the `/barcodes` endpoint.
 *
 * Maps to the [bwip-js](https://github.com/metafloor/bwip-js) symbology IDs accepted by
 * the backend renderer. `codabar` is a backend alias for `rationalizedCodabar`.
 */
exports.BarcodeTypeSchema = zod_1.z.enum([
    'qrcode',
    'code128',
    'azteccode',
    'pdf417',
    'rationalizedCodabar',
    'codabar',
]);
/**
 * Schema for input accepted by {@link ../endpoint/BarcodesEndpoint.BarcodesEndpoint.render}.
 */
exports.BarcodeRenderInputSchema = zod_1.z
    .object({
    /**
     * The symbology to render.
     */
    type: exports.BarcodeTypeSchema,
    /**
     * The data to encode in the barcode.
     */
    data: zod_1.z.string(),
    /**
     * The width of the barcode in pixels. Must be between 100 and 1000 when set.
     */
    width: zod_1.z.number().optional(),
    /**
     * The height of the barcode in pixels. Must be between 10 and 1000 when set.
     */
    height: zod_1.z.number().optional(),
    /**
     * The bar color (hex string). Defaults to `#000000`.
     */
    color: zod_1.z.string().optional(),
    /**
     * The background color (hex string). Defaults to `#FFFFFF`.
     */
    background: zod_1.z.string().optional(),
})
    .passthrough();
