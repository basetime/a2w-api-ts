import { z } from 'zod';

/**
 * Schema for a snippet library.
 */
export const SnippetLibrarySchema = z
  .object({
    /**
     * The snippet library ID.
     */
    id: z.string(),

    /**
     * The name of the snippet library.
     */
    name: z.string(),

    /**
     * The description of the snippet library.
     */
    description: z.string(),

    /**
     * The value of the snippet library.
     */
    code: z.string(),

    /**
     * The packages to install.
     *
     * This is a list of NPM package names in the form of `package-name@version`.
     */
    packages: z.array(z.string()),

    /**
     * The organization that owns the snippet library.
     */
    organization: z.string(),
  })
  .passthrough();

/**
 * Entity for the snippetLibraries collection.
 */
export type SnippetLibrary = z.infer<typeof SnippetLibrarySchema>;
