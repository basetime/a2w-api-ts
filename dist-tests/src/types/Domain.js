"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for a domain name.
 */
exports.DomainSchema = zod_1.z
    .object({
    /**
     * The ID of the organization.
     */
    organization: zod_1.z.string(),
    /**
     * The name of the organization.
     */
    name: zod_1.z.string(),
    /**
     * The domain of the organization.
     */
    domain: zod_1.z.string(),
    /**
     * Root domain of the domain
     */
    hostname: zod_1.z.string(),
    /**
     * The URL to the homepage redirect.
     */
    homepageRedirectUrl: zod_1.z.string(),
    /**
     * Value for CNAME Record Validation => GUID.domain.com.
     */
    cNameVerification: zod_1.z.string(),
    /**
     * The CNAME Record Name
     */
    cNameDomain: zod_1.z.string(),
    /**
     * Processing Status
     */
    isProcessing: zod_1.z.boolean(),
    /**
     * Validation Status
     */
    status: zod_1.z.enum(['valid', 'invalid', 'pending', 'still_pending']),
    /**
     * Is Active Domain
     */
    isActive: zod_1.z.boolean(),
    /**
     * Is Active Domain
     */
    isDeleted: zod_1.z.boolean(),
    /**
     * Validation Date
     */
    validationDate: zod_1.z.coerce.date().optional(),
    /**
     * First time domain validity was checked
     */
    firstChecked: zod_1.z.coerce.date().optional(),
})
    .passthrough();
