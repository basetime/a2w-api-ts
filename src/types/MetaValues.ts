import { z } from 'zod';

/**
 * Schema for the meta value keys.
 */
export const MetaValueSchema = z.enum([
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
 * Instructions for how to build the passes.
 */
export type MetaValue = z.infer<typeof MetaValueSchema>;

/**
 * Schema for the meta values that can be set in the query parameters.
 */
export const MetaValuesSchema = z
  .object({
    bundle: z.string().optional(),
    banner: z.string().optional(),
    logo: z.string().optional(),
    thumbnail: z.string().optional(),
    backgroundColor: z.string().optional(),
    foregroundColor: z.string().optional(),
    labelColor: z.string().optional(),
    barcodeFormat: z.string().optional(),
  })
  .passthrough();

/**
 * The meta values that can be set in the query parameters.
 */
export type MetaValues = z.infer<typeof MetaValuesSchema>;
