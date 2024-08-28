/**
 * Instructions for how to build the passes.
 */
export type MetaValue =
  | 'bundle'
  | 'banner'
  | 'logo'
  | 'thumbnail'
  | 'backgroundColor'
  | 'foregroundColor'
  | 'labelColor'
  | 'barcodeFormat';

/**
 * The meta values that can be set in the query parameters.
 */
export type MetaValues = {
  [key in MetaValue]?: string;
};
