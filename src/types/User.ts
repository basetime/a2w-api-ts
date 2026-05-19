import { z } from 'zod';

/**
 * Schema for a user.
 */
export const UserSchema = z
  .object({
    /**
     * The ID of the user.
     */
    id: z.string(),

    /**
     * The display name of the user.
     */
    displayName: z.string(),

    /**
     * The email address of the user.
     */
    email: z.string(),

    /**
     * The avatar URL of the user.
     */
    photoURL: z.string(),

    /**
     * The color of the user's avatar.
     */
    avatarColor: z.string(),

    /**
     * The organizations the user belongs to.
     */
    organizations: z.array(z.string()),

    /**
     * The display names of the organizations the user belongs to.
     */
    clientsDisplay: z.array(z.string()),

    /**
     * The date the user last logged in.
     */
    dateLastLogin: z.coerce.date(),
  })
  .passthrough();

/**
 * Represents a user.
 */
export type User = z.infer<typeof UserSchema>;
