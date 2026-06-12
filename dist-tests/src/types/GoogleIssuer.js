"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleIssuerExportSchema = exports.GoogleIssuerSchema = exports.IssuerContactInfoSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for contact information on a Google Wallet issuer.
 */
exports.IssuerContactInfoSchema = zod_1.z
    .object({
    /**
     * The contact name.
     */
    name: zod_1.z.string(),
    /**
     * The contact phone number.
     */
    phone: zod_1.z.string(),
    /**
     * The contact email address.
     */
    email: zod_1.z.string(),
    /**
     * Email addresses that receive issuer alerts.
     */
    alertsEmails: zod_1.z.array(zod_1.z.string()),
})
    .passthrough();
/**
 * Schema for a sanitized Google Wallet issuer owned by an organization.
 *
 * Service-account credentials are omitted from list responses.
 */
exports.GoogleIssuerSchema = zod_1.z
    .object({
    /**
     * The issuer ID.
     */
    id: zod_1.z.string(),
    /**
     * The display name of the issuer.
     */
    name: zod_1.z.string(),
    /**
     * Contact information for the issuer.
     */
    contactInfo: exports.IssuerContactInfoSchema.optional(),
    /**
     * The URL to the issuer's homepage.
     */
    homepageUrl: zod_1.z.string().optional(),
    /**
     * Whether this is the organization's default Google issuer.
     */
    isDefault: zod_1.z.boolean(),
    /**
     * The date the issuer was created.
     */
    createdDate: zod_1.z.coerce.date(),
})
    .passthrough();
/**
 * Schema for the full Google issuer returned by the export endpoint.
 *
 * Includes the service-account credentials. Only retrievable with a one-time token
 * obtained from the confirm endpoint.
 */
exports.GoogleIssuerExportSchema = zod_1.z
    .object({
    /**
     * The issuer ID.
     */
    id: zod_1.z.string(),
    /**
     * The display name of the issuer.
     */
    name: zod_1.z.string(),
    /**
     * The service-account credentials.
     */
    credentials: zod_1.z.any(),
})
    .passthrough();
