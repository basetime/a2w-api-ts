"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for information needed to generate a pass.
 */
exports.PassSchema = zod_1.z
    .object({
    /**
     * The pass ID.
     */
    id: zod_1.z.string(),
    /**
     * The ID of the bundle the pass belongs to.
     */
    bundle: zod_1.z.string(),
    /**
     * The ID of the job that created the pass.
     */
    jobId: zod_1.z.string(),
    /**
     * The serial number of the pass.
     *
     * The serial number is important to updating wallets.
     */
    serialNumber: zod_1.z.string(),
    /**
     * The object store.
     */
    objectStore: zod_1.z.record(zod_1.z.string(), zod_1.z.union([zod_1.z.string(), zod_1.z.number(), zod_1.z.boolean(), zod_1.z.null()])),
    /**
     * MD5 of the data for easier comparison.
     */
    objectStoreMD5: zod_1.z.string(),
    /**
     * The value of the primary key in the data.
     */
    primaryKey: zod_1.z.string(),
    /**
     * The pass type identifier.
     */
    passTypeIdentifier: zod_1.z.string(),
    /**
     * The campaign the pass belongs to.
     */
    campaignId: zod_1.z.string(),
    /**
     * The organization the pass belongs to.
     */
    organizationId: zod_1.z.string(),
    /**
     * The template ID.
     */
    templateId: zod_1.z.string(),
    /**
     * The template version.
     */
    templateVersion: zod_1.z.number(),
    /**
     * The enrollment associated with the pass, when one exists.
     */
    enrollment: zod_1.z.string().optional(),
    /**
     * The ID request log that claimed the pass.
     */
    requestLog: zod_1.z.string(),
    /**
     * The ID of the saved google object.
     */
    googleObjectId: zod_1.z.string().optional(),
    /**
     * Whether the pass has been claimed.
     */
    isClaimed: zod_1.z.boolean(),
    /**
     * Whether the pass has been scanned.
     */
    isScanned: zod_1.z.boolean(),
    /**
     * Whether the pass has been redeemed.
     */
    isRedeemed: zod_1.z.boolean(),
    /**
     * The date the pass was created
     */
    createdMillis: zod_1.z.number().optional(),
    /**
     * The date the pass was last updated.
     */
    updatedDate: zod_1.z.coerce.date(),
    /**
     * The date the pass was created.
     */
    createdDate: zod_1.z.coerce.date(),
})
    .passthrough();
