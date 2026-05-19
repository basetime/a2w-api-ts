import { z } from 'zod';
import { DomainSchema } from './Domain';
import { UserSchema } from './User';

/**
 * Schema for an organization.
 */
export const OrganizationSchema = z
  .object({
    /**
     * The ID of the organization.
     */
    id: z.string(),

    /**
     * The name of the organization.
     */
    name: z.string(),

    /**
     * The URL of the logo.
     */
    logoUrl: z.string(),

    /**
     * The domain of the organization.
     */
    domain: DomainSchema.nullable(),

    /**
     * The background color of the organization.
     */
    backgroundColor: z.string(),

    /**
     * The URL of the favicon 16x16.
     */
    favIcon16: z.string(),

    /**
     * The URL of the favicon 32x32.
     */
    favIcon32: z.string(),

    /**
     * The URL of the favicon 48x48.
     */
    favIcon48: z.string(),

    /**
     * The URL of the favicon 120x120.
     */
    favIcon120: z.string(),

    /**
     * The URL of the favicon 240x240.
     */
    favIcon240: z.string(),

    /**
     * The default proximity UUID.
     */
    defaultProximityUUID: z.string(),

    /**
     * The URL to the terms page, not actually the html!
     */
    termsHtml: z.string(),

    /**
     * The URL to the privacy page, not actually the html!
     */
    privacyHtml: z.string(),

    /**
     * The code to add to every page related to the organization.
     */
    headerPixels: z.string().optional(),

    /**
     * The code to add to every page related to the organization.
     */
    footerPixels: z.string().optional(),

    /**
     * The ID of the owner of the organization.
     */
    owner: z.string(),

    /**
     * The owner of the organization.
     */
    ownerUser: UserSchema.optional(),

    /**
     * The IDs of the admins in the organization.
     */
    admins: z.array(z.string()),

    /**
     * The IDs of the editors in the organization.
     */
    editors: z.array(z.string()),

    /**
     * The join code for the organization.
     */
    joinCode: z.string(),
  })
  .passthrough();

/**
 * Represents an organization.
 */
export type Organization = z.infer<typeof OrganizationSchema>;
