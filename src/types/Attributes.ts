import { z } from 'zod';

/**
 * Schema for the possible types of attributes.
 */
export const AttributeTypeSchema = z.enum(['text', 'boolean', 'number']);

/**
 * The possible types of attributes.
 */
export type AttributeType = z.infer<typeof AttributeTypeSchema>;

/**
 * Schema for a single attribute.
 */
export const AttributeItemSchema = z
  .object({
    /**
     * A unique key for the attribute.
     */
    key: z.string(),

    /**
     * Description of the attribute.
     */
    description: z.string(),

    /**
     * The value of the attribute.
     */
    value: z.union([z.string(), z.boolean()]),

    /**
     * The type of the value.
     */
    type: AttributeTypeSchema,
  })
  .passthrough();

/**
 * A single attribute.
 */
export type AttributeItem = z.infer<typeof AttributeItemSchema>;

/**
 * Schema for an attribute collection.
 */
export const AttributesSchema = z
  .object({
    /**
     * The items of the attribute.
     */
    items: z.array(AttributeItemSchema),
  })
  .passthrough();

/**
 * Represents an attribute collection.
 */
export type Attributes = z.infer<typeof AttributesSchema>;
