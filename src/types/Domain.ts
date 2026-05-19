import { z } from 'zod';

/**
 * Schema for a domain name.
 */
export const DomainSchema = z
  .object({
    /**
     * The ID of the organization.
     */
    organization: z.string(),

    /**
     * The name of the organization.
     */
    name: z.string(),

    /**
     * The domain of the organization.
     */
    domain: z.string(),

    /**
     * Root domain of the domain
     */
    hostname: z.string(),

    /**
     * The URL to the homepage redirect.
     */
    homepageRedirectUrl: z.string(),

    /**
     * Value for CNAME Record Validation => GUID.domain.com.
     */
    cNameVerification: z.string(),

    /**
     * The CNAME Record Name
     */
    cNameDomain: z.string(),

    /**
     * Processing Status
     */
    isProcessing: z.boolean(),

    /**
     * Validation Status
     */
    status: z.enum(['valid', 'invalid', 'pending', 'still_pending']),

    /**
     * Is Active Domain
     */
    isActive: z.boolean(),

    /**
     * Is Active Domain
     */
    isDeleted: z.boolean(),

    /**
     * Validation Date
     */
    validationDate: z.coerce.date().optional(),

    /**
     * First time domain validity was checked
     */
    firstChecked: z.coerce.date().optional(),
  })
  .passthrough();

/**
 * Represents a domain name.
 */
export type Domain = z.infer<typeof DomainSchema>;
