import { z } from 'zod';

/**
 * Schema for the barcode types supported by the `/barcodes` endpoint.
 *
 * Maps to the [bwip-js](https://github.com/metafloor/bwip-js) symbology IDs accepted by
 * the backend renderer. `codabar` is a backend alias for `rationalizedCodabar`.
 */
export const BarcodeTypeSchema = z.enum([
  'qrcode',
  'code128',
  'azteccode',
  'pdf417',
  'rationalizedCodabar',
  'codabar',
]);

/**
 * The barcode types supported by the `/barcodes` endpoint.
 */
export type BarcodeType = z.infer<typeof BarcodeTypeSchema>;

/**
 * Schema for input accepted by {@link ../endpoint/BarcodesEndpoint.BarcodesEndpoint.render}.
 */
export const BarcodeRenderInputSchema = z
  .object({
    /**
     * The symbology to render.
     */
    type: BarcodeTypeSchema,

    /**
     * The data to encode in the barcode.
     */
    data: z.string(),

    /**
     * The width of the barcode in pixels. Must be between 100 and 1000 when set.
     */
    width: z.number().optional(),

    /**
     * The height of the barcode in pixels. Must be between 10 and 1000 when set.
     */
    height: z.number().optional(),

    /**
     * The bar color (hex string). Defaults to `#000000`.
     */
    color: z.string().optional(),

    /**
     * The background color (hex string). Defaults to `#FFFFFF`.
     */
    background: z.string().optional(),
  })
  .passthrough();

/**
 * Input accepted by {@link ../endpoint/BarcodesEndpoint.BarcodesEndpoint.render}.
 */
export type BarcodeRenderInput = z.infer<typeof BarcodeRenderInputSchema>;

/**
 * Backwards-compatible alias for {@link BarcodeRenderInput}.
 */
export type Barcode = BarcodeRenderInput;
