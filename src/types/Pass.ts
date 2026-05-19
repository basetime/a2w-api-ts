import { z } from 'zod';

/**
 * Schema for information needed to generate a pass.
 */
export const PassSchema = z
  .object({
    /**
     * The pass ID.
     */
    id: z.string(),

    /**
     * The ID of the bundle the pass belongs to.
     */
    bundle: z.string(),

    /**
     * The ID of the job that created the pass.
     */
    jobId: z.string(),

    /**
     * The serial number of the pass.
     *
     * The serial number is important to updating wallets.
     */
    serialNumber: z.string(),

    /**
     * The object store.
     */
    objectStore: z.record(
      z.string(),
      z.union([z.string(), z.number(), z.boolean(), z.null()]),
    ),

    /**
     * MD5 of the data for easier comparison.
     */
    objectStoreMD5: z.string(),

    /**
     * The value of the primary key in the data.
     */
    primaryKey: z.string(),

    /**
     * The pass type identifier.
     */
    passTypeIdentifier: z.string(),

    /**
     * The campaign the pass belongs to.
     */
    campaignId: z.string(),

    /**
     * The organization the pass belongs to.
     */
    organizationId: z.string(),

    /**
     * The template ID.
     */
    templateId: z.string(),

    /**
     * The template version.
     */
    templateVersion: z.number(),

    /**
     * The enrollment associated with the pass, when one exists.
     */
    enrollment: z.string().optional(),

    /**
     * The ID request log that claimed the pass.
     */
    requestLog: z.string(),

    /**
     * The ID of the saved google object.
     */
    googleObjectId: z.string().optional(),

    /**
     * Whether the pass has been claimed.
     */
    isClaimed: z.boolean(),

    /**
     * Whether the pass has been scanned.
     */
    isScanned: z.boolean(),

    /**
     * Whether the pass has been redeemed.
     */
    isRedeemed: z.boolean(),

    /**
     * The date the pass was created
     */
    createdMillis: z.number().optional(),

    /**
     * The date the pass was last updated.
     */
    updatedDate: z.coerce.date(),

    /**
     * The date the pass was created.
     */
    createdDate: z.coerce.date(),
  })
  .passthrough();

/**
 * Information needed to generate a pass.
 */
export type Pass = z.infer<typeof PassSchema>;
