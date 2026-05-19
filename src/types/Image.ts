import { z } from 'zod';

/**
 * Schema for an image that can be used on the frontend.
 */
export const ImageSchema = z
  .object({
    /**
     * The name of the image.
     */
    name: z.string(),

    /**
     * The URL of the image.
     */
    url: z.string(),

    /**
     * The tags associated with the image.
     */
    tags: z.array(z.string()),

    /**
     * The width of the image.
     */
    width: z.number(),

    /**
     * The height of the image.
     */
    height: z.number(),

    /**
     * The size of the image in bytes.
     */
    size: z.number(),

    /**
     * The mime type of the image.
     */
    mimeType: z.string(),

    /**
     * The md5 hash of the image.
     */
    md5: z.string(),

    /**
     * The ID of the folder the template belongs to.
     */
    folder: z.string(),
  })
  .passthrough();

/**
 * Represents an image that can be used on the frontend.
 */
export type Image = z.infer<typeof ImageSchema>;
