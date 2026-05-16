/**
 * The barcode types supported by the `/barcodes` endpoint.
 *
 * Maps to the [bwip-js](https://github.com/metafloor/bwip-js) symbology IDs accepted by
 * the backend renderer. `codabar` is a backend alias for `rationalizedCodabar`.
 */
export type BarcodeType =
  | 'qrcode'
  | 'code128'
  | 'azteccode'
  | 'pdf417'
  | 'rationalizedCodabar'
  | 'codabar';

/**
 * Input accepted by {@link ../endpoint/BarcodesEndpoint.BarcodesEndpoint.render}.
 */
export interface BarcodeRenderInput {
  /**
   * The symbology to render.
   */
  type: BarcodeType;

  /**
   * The data to encode in the barcode.
   */
  data: string;

  /**
   * The width of the barcode in pixels. Must be between 100 and 1000 when set.
   */
  width?: number;

  /**
   * The height of the barcode in pixels. Must be between 10 and 1000 when set.
   */
  height?: number;

  /**
   * The bar color (hex string). Defaults to `#000000`.
   */
  color?: string;

  /**
   * The background color (hex string). Defaults to `#FFFFFF`.
   */
  background?: string;
}

/**
 * Backwards-compatible alias for {@link BarcodeRenderInput}.
 */
export type Barcode = BarcodeRenderInput;
