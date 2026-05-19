import { z } from 'zod';

/**
 * Schema for an API key.
 */
export const ApiKeySchema = z
  .object({
    /**
     * The ID of the API key.
     */
    id: z.string(),

    /**
     * The user supplied name of the API key.
     */
    name: z.string(),

    /**
     * A random string that is used to authenticate the API key.
     */
    key: z.string(),

    /**
     * A random string that is used to authenticate the API key.
     */
    secret: z.string(),

    /**
     * The ID of the organization the API key belongs to.
     */
    organizationId: z.string(),

    /**
     * The ID of the scanner app the API key belongs to.
     */
    scannerApp: z.string().optional(),

    /**
     * Whether this API key belongs to a scanner.
     */
    isScanner: z.boolean().optional(),

    /**
     * Whether the API key has been deleted.
     */
    isDeleted: z.boolean().optional(),

    /**
     * The date the API key was created.
     */
    createdDate: z.coerce.date(),
  })
  .passthrough();

/**
 * Instance of an API key.
 */
export type ApiKey = z.infer<typeof ApiKeySchema>;
