import { z } from 'zod';
import { CampaignStatsSchema } from './CampaignStats';
import { OrganizationSchema } from './Organization';
import { ScheduleSchema } from './Schedule';
import { TemplateSchema } from './Template';

/**
 * Schema for the details of a campaign.
 */
export const CampaignSchema = z
  .object({
    /**
     * The ID of the campaign.
     */
    id: z.string(),

    /**
     * The name of the campaign.
     */
    name: z.string(),

    /**
     * The organization that owns the campaign.
     */
    client: OrganizationSchema,

    /**
     * The templates used by the campaign.
     */
    templates: z.array(TemplateSchema),

    /**
     * The ID of the landing page.
     */
    landingPage: z.string(),

    /**
     * The name of the primary key to save from imported csv data.
     */
    primaryKey: z.string(),

    /**
     * The tags associated with the campaign.
     */
    tags: z.array(z.string()),

    /**
     * The description of the campaign.
     */
    description: z.string(),

    /**
     * Code added to the head of the claims page.
     */
    headerPixels: z.string().optional(),

    /**
     * Code added to the footer of the claims page.
     */
    footerPixels: z.string().optional(),

    /**
     * Is anyone allowed to join the campaign?
     */
    openEnrollment: z.boolean(),

    /**
     * The ID of the landing page for open enrollment.
     */
    openEnrollmentLandingPage: z.string(),

    /**
     * The permalink to the open enrollment page.
     */
    openEnrollmentPermalink: z.string(),

    /**
     * The auto-submit jwt secret.
     *
     * The form values for open enrollment may be passed as query params. They may
     * also be passed as a JWT token. This secret is used to verify the signature
     * of the JWT token.
     */
    openEnrollmentJwtSecret: z.string(),

    /**
     * The ID of the integration used to import data.
     */
    importDataSource: z.string(),

    /**
     * The ID of the integration used to export data.
     */
    exportDataSource: z.string(),

    /**
     * The configuration for the import integration.
     */
    importConfig: z.unknown(),

    /**
     * The configuration for the export integration.
     */
    exportConfig: z.unknown(),

    /**
     * Who (by email) should be notified when a job finishes?
     */
    jobNotifications: z.string(),

    /**
     * The number of passes created by the campaign.
     */
    passesCount: z.number(),

    /**
     * The number of passes claimed by the campaign.
     */
    claimedCount: z.number(),

    /**
     * The number of wallets that registered.
     */
    registeredCount: z.number(),

    /**
     * The number of enrollments.
     */
    enrolledCount: z.number(),

    /**
     * Is the campaign deleted?
     */
    isDeleted: z.boolean(),

    /**
     * The Apple pass type identifier, copied from the template.
     */
    passTypeIdentifier: z.string(),

    /**
     * The Google issuer, copied from the template.
     */
    googleIssuer: z.string(),

    /**
     * When the campaign launched, null if not running.
     */
    runningDate: z.coerce.date().nullable(),

    /**
     * The updatedDate value from the template the last time we pushed changes.
     */
    templateLastChangeDate: z.coerce.date().nullable(),

    /**
     * The current updatedDate value from the template.
     */
    templateCurrentChangeDate: z.coerce.date().nullable(),

    /**
     * The schedule for the campaign.
     */
    schedule: ScheduleSchema.optional(),

    /**
     * The ID of the folder the campaign belongs to.
     */
    folder: z.string(),

    /**
     * The stats for the campaign.
     */
    stats: CampaignStatsSchema,

    /**
     * The browsers that have accessed the campaign.
     */
    browsers: z.record(z.string(), z.number()),

    /**
     * The countries that have accessed the campaign.
     */
    countries: z.record(z.string(), z.number()),

    /**
     * The states that have accessed the campaign.
     */
    states: z.record(z.string(), z.number()),

    /**
     * The date the campaign was created.
     */
    createdDate: z.coerce.date(),
  })
  .passthrough();

/**
 * The details of a campaign.
 */
export type Campaign = z.infer<typeof CampaignSchema>;
