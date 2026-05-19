"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignSchema = void 0;
const zod_1 = require("zod");
const CampaignStats_1 = require("./CampaignStats");
const Organization_1 = require("./Organization");
const Schedule_1 = require("./Schedule");
const Template_1 = require("./Template");
/**
 * Schema for the details of a campaign.
 */
exports.CampaignSchema = zod_1.z
    .object({
    /**
     * The ID of the campaign.
     */
    id: zod_1.z.string(),
    /**
     * The name of the campaign.
     */
    name: zod_1.z.string(),
    /**
     * The organization that owns the campaign.
     */
    client: Organization_1.OrganizationSchema,
    /**
     * The templates used by the campaign.
     */
    templates: zod_1.z.array(Template_1.TemplateSchema),
    /**
     * The ID of the landing page.
     */
    landingPage: zod_1.z.string(),
    /**
     * The name of the primary key to save from imported csv data.
     */
    primaryKey: zod_1.z.string(),
    /**
     * The tags associated with the campaign.
     */
    tags: zod_1.z.array(zod_1.z.string()),
    /**
     * The description of the campaign.
     */
    description: zod_1.z.string(),
    /**
     * Code added to the head of the claims page.
     */
    headerPixels: zod_1.z.string().optional(),
    /**
     * Code added to the footer of the claims page.
     */
    footerPixels: zod_1.z.string().optional(),
    /**
     * Is anyone allowed to join the campaign?
     */
    openEnrollment: zod_1.z.boolean(),
    /**
     * The ID of the landing page for open enrollment.
     */
    openEnrollmentLandingPage: zod_1.z.string(),
    /**
     * The permalink to the open enrollment page.
     */
    openEnrollmentPermalink: zod_1.z.string(),
    /**
     * The auto-submit jwt secret.
     *
     * The form values for open enrollment may be passed as query params. They may
     * also be passed as a JWT token. This secret is used to verify the signature
     * of the JWT token.
     */
    openEnrollmentJwtSecret: zod_1.z.string(),
    /**
     * The ID of the integration used to import data.
     */
    importDataSource: zod_1.z.string(),
    /**
     * The ID of the integration used to export data.
     */
    exportDataSource: zod_1.z.string(),
    /**
     * The configuration for the import integration.
     */
    importConfig: zod_1.z.unknown(),
    /**
     * The configuration for the export integration.
     */
    exportConfig: zod_1.z.unknown(),
    /**
     * Who (by email) should be notified when a job finishes?
     */
    jobNotifications: zod_1.z.string(),
    /**
     * The number of passes created by the campaign.
     */
    passesCount: zod_1.z.number(),
    /**
     * The number of passes claimed by the campaign.
     */
    claimedCount: zod_1.z.number(),
    /**
     * The number of wallets that registered.
     */
    registeredCount: zod_1.z.number(),
    /**
     * The number of enrollments.
     */
    enrolledCount: zod_1.z.number(),
    /**
     * Is the campaign deleted?
     */
    isDeleted: zod_1.z.boolean(),
    /**
     * The Apple pass type identifier, copied from the template.
     */
    passTypeIdentifier: zod_1.z.string(),
    /**
     * The Google issuer, copied from the template.
     */
    googleIssuer: zod_1.z.string(),
    /**
     * When the campaign launched, null if not running.
     */
    runningDate: zod_1.z.coerce.date().nullable(),
    /**
     * The updatedDate value from the template the last time we pushed changes.
     */
    templateLastChangeDate: zod_1.z.coerce.date().nullable(),
    /**
     * The current updatedDate value from the template.
     */
    templateCurrentChangeDate: zod_1.z.coerce.date().nullable(),
    /**
     * The schedule for the campaign.
     */
    schedule: Schedule_1.ScheduleSchema.optional(),
    /**
     * The ID of the folder the campaign belongs to.
     */
    folder: zod_1.z.string(),
    /**
     * The stats for the campaign.
     */
    stats: CampaignStats_1.CampaignStatsSchema,
    /**
     * The browsers that have accessed the campaign.
     */
    browsers: zod_1.z.record(zod_1.z.string(), zod_1.z.number()),
    /**
     * The countries that have accessed the campaign.
     */
    countries: zod_1.z.record(zod_1.z.string(), zod_1.z.number()),
    /**
     * The states that have accessed the campaign.
     */
    states: zod_1.z.record(zod_1.z.string(), zod_1.z.number()),
    /**
     * The date the campaign was created.
     */
    createdDate: zod_1.z.coerce.date(),
})
    .passthrough();
