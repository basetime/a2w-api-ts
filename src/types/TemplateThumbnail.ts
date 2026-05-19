import { z } from 'zod';
import { TemplateAttributesSchema } from './Template';

/**
 * Schema for the details needed to render a template thumbnail.
 */
export const TemplateThumbnailSchema = z
  .object({
    /**
     * The ID of the template.
     */
    id: z.string(),

    /**
     * The name of the template.
     */
    name: z.string(),

    /**
     * The version of the template.
     */
    version: z.number(),

    /**
     * URL of the png thumbnail for the template.
     */
    thumbnail: z.string(),

    /**
     * The description of the template.
     */
    description: z.string(),

    /**
     * The attributes of the template.
     */
    attributes: TemplateAttributesSchema,

    /**
     * The logo text for the template.
     */
    logoText: z.string(),

    /**
     * Primary text for the template.
     */
    primaryText: z.string(),

    /**
     * Header text for the template.
     */
    headerText: z.string(),

    /**
     * Secondary text for the template.
     */
    secondaryText: z.string(),

    /**
     * The logo URL for the template.
     */
    logo: z.string(),

    /**
     * The banner URL for the template.
     */
    banner: z.string(),

    /**
     * The background color of the template.
     */
    backgroundColor: z.string(),

    /**
     * The foreground color of the template.
     */
    foregroundColor: z.string(),

    /**
     * The URL of the screenshot for the template.
     */
    screenshotUrl: z.string().optional(),

    /**
     * The URL of the Apple screenshot for the template.
     */
    screenshotAppleUrl: z.string().optional(),

    /**
     * The URL of the Android screenshot for the template.
     */
    screenshotAndroidUrl: z.string().optional(),

    /**
     * The date the template was created.
     */
    createdDate: z.coerce.date(),
  })
  .passthrough();

/**
 * The details needed to render a template thumbnail.
 */
export type TemplateThumbnail = z.infer<typeof TemplateThumbnailSchema>;
