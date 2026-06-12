import { z } from 'zod';

/**
 * Schema for a sanitized Apple pass type owned by an organization.
 *
 * Sensitive fields (signer certificate, key, passphrase) are omitted from list responses.
 */
export const PassTypeSchema = z
  .object({
    /**
     * The pass type identifier.
     */
    id: z.string(),

    /**
     * The Apple Developer team identifier.
     */
    teamIdentifier: z.string(),

    /**
     * Whether this is the organization's default pass type.
     */
    isDefault: z.boolean(),

    /**
     * The date the pass type was created.
     */
    createdDate: z.coerce.date(),

    /**
     * The date the signing certificate expires.
     */
    expiresDate: z.coerce.date(),
  })
  .passthrough();

/**
 * A sanitized Apple pass type owned by an organization.
 */
export type PassType = z.infer<typeof PassTypeSchema>;

/**
 * Schema for the full pass type returned by the export endpoint.
 *
 * Includes the signer certificate, key, and passphrase.
 */
export const PassTypeExportSchema = z
  .object({
    /**
     * The pass type identifier.
     */
    id: z.string(),

    /**
     * The signer certificate (PEM).
     */
    signerCert: z.string(),

    /**
     * The signer private key (PEM).
     */
    signerKey: z.string(),

    /**
     * The passphrase for the signer key, or an empty string when unset.
     */
    signerKeyPassphrase: z.string(),

    /**
     * The Apple Developer team identifier.
     */
    teamIdentifier: z.string(),
  })
  .passthrough();

/**
 * The full pass type returned by the export endpoint.
 */
export type PassTypeExport = z.infer<typeof PassTypeExportSchema>;
