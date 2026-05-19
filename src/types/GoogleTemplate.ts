import { z } from 'zod';

/**
 * Schema for the Google Wallet portion of a template.
 *
 * The backend only exposes the issuer ID on this object today; additional fields are
 * allowed via `passthrough()` so future server additions don't break consumers.
 */
export const GoogleTemplateSchema = z
  .object({
    /**
     * The Google issuer ID.
     */
    id: z.string(),
  })
  .passthrough();

/**
 * The Google Wallet portion of a template.
 */
export type GoogleTemplate = z.infer<typeof GoogleTemplateSchema>;
