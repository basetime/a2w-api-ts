"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassTypeExportSchema = exports.PassTypeSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for a sanitized Apple pass type owned by an organization.
 *
 * Sensitive fields (signer certificate, key, passphrase) are omitted from list responses.
 */
exports.PassTypeSchema = zod_1.z
    .object({
    /**
     * The pass type identifier.
     */
    id: zod_1.z.string(),
    /**
     * The Apple Developer team identifier.
     */
    teamIdentifier: zod_1.z.string(),
    /**
     * Whether this is the organization's default pass type.
     */
    isDefault: zod_1.z.boolean(),
    /**
     * The date the pass type was created.
     */
    createdDate: zod_1.z.coerce.date(),
    /**
     * The date the signing certificate expires.
     */
    expiresDate: zod_1.z.coerce.date(),
})
    .passthrough();
/**
 * Schema for the full pass type returned by the export endpoint.
 *
 * Includes the signer certificate, key, and passphrase.
 */
exports.PassTypeExportSchema = zod_1.z
    .object({
    /**
     * The pass type identifier.
     */
    id: zod_1.z.string(),
    /**
     * The signer certificate (PEM).
     */
    signerCert: zod_1.z.string(),
    /**
     * The signer private key (PEM).
     */
    signerKey: zod_1.z.string(),
    /**
     * The passphrase for the signer key, or an empty string when unset.
     */
    signerKeyPassphrase: zod_1.z.string(),
    /**
     * The Apple Developer team identifier.
     */
    teamIdentifier: zod_1.z.string(),
})
    .passthrough();
