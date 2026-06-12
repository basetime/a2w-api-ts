import { z } from 'zod';

/**
 * Schema for contact information on a Google Wallet issuer.
 */
export const IssuerContactInfoSchema = z
  .object({
    /**
     * The contact name.
     */
    name: z.string(),

    /**
     * The contact phone number.
     */
    phone: z.string(),

    /**
     * The contact email address.
     */
    email: z.string(),

    /**
     * Email addresses that receive issuer alerts.
     */
    alertsEmails: z.array(z.string()),
  })
  .passthrough();

/**
 * Contact information on a Google Wallet issuer.
 */
export type IssuerContactInfo = z.infer<typeof IssuerContactInfoSchema>;

/**
 * Schema for a sanitized Google Wallet issuer owned by an organization.
 *
 * Service-account credentials are omitted from list responses.
 */
export const GoogleIssuerSchema = z
  .object({
    /**
     * The issuer ID.
     */
    id: z.string(),

    /**
     * The display name of the issuer.
     */
    name: z.string(),

    /**
     * Contact information for the issuer.
     */
    contactInfo: IssuerContactInfoSchema.optional(),

    /**
     * The URL to the issuer's homepage.
     */
    homepageUrl: z.string().optional(),

    /**
     * Whether this is the organization's default Google issuer.
     */
    isDefault: z.boolean(),

    /**
     * The date the issuer was created.
     */
    createdDate: z.coerce.date(),
  })
  .passthrough();

/**
 * A sanitized Google Wallet issuer owned by an organization.
 */
export type GoogleIssuer = z.infer<typeof GoogleIssuerSchema>;

/**
 * Schema for the full Google issuer returned by the export endpoint.
 *
 * Includes the service-account credentials.
 */
export const GoogleIssuerExportSchema = z
  .object({
    /**
     * The issuer ID.
     */
    id: z.string(),

    /**
     * The display name of the issuer.
     */
    name: z.string(),

    /**
     * The service-account credentials.
     */
    credentials: z.any(),
  })
  .passthrough();

/**
 * The full Google issuer returned by the export endpoint.
 */
export type GoogleIssuerExport = z.infer<typeof GoogleIssuerExportSchema>;
