"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletUpdateSchema = exports.WalletUpdateReasonSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for the reason a wallet was pushed.
 *
 * Backend pushes are tagged with the reason they were created so consumers can filter the
 * log stream by intent. The set is expected to grow over time; new reasons are added on
 * the backend, so the schema accepts any string while the common ones autocomplete via
 * the TypeScript union below.
 */
exports.WalletUpdateReasonSchema = zod_1.z.string();
/**
 * Schema for a push notification sent to an installed wallet.
 *
 * Returned by `client.campaigns.wallets.getPushLogs(...)`.
 */
exports.WalletUpdateSchema = zod_1.z
    .object({
    /**
     * The ID of the wallet update.
     */
    id: zod_1.z.string(),
    /**
     * The campaign the update belongs to.
     */
    campaign: zod_1.z.string(),
    /**
     * The ID of the pass that was pushed.
     */
    pass: zod_1.z.string(),
    /**
     * The wallet type (`apple` or `google`).
     */
    type: zod_1.z.enum(['apple', 'google']),
    /**
     * Why the push was sent.
     */
    reason: exports.WalletUpdateReasonSchema,
    /**
     * Whether the push was acknowledged by the device.
     */
    acknowledged: zod_1.z.boolean(),
    /**
     * Optional error message if the push failed.
     */
    error: zod_1.z.string().nullable().optional(),
    /**
     * The date the push was sent.
     */
    createdDate: zod_1.z.coerce.date(),
})
    .passthrough();
