import { z } from 'zod';

/**
 * Schema for the reason a wallet was pushed.
 *
 * Backend pushes are tagged with the reason they were created so consumers can filter the
 * log stream by intent. The set is expected to grow over time; new reasons are added on
 * the backend, so the schema accepts any string while the common ones autocomplete via
 * the TypeScript union below.
 */
export const WalletUpdateReasonSchema = z.string();

/**
 * Why the wallet was pushed.
 */
export type WalletUpdateReason =
  | 'updatedPass'
  | 'updatedTemplate'
  | 'manualPush'
  | (string & {});

/**
 * Schema for a push notification sent to an installed wallet.
 *
 * Returned by `client.campaigns.wallets.getPushLogs(...)`.
 */
export const WalletUpdateSchema = z
  .object({
    /**
     * The ID of the wallet update.
     */
    id: z.string(),

    /**
     * The campaign the update belongs to.
     */
    campaign: z.string(),

    /**
     * The ID of the pass that was pushed.
     */
    pass: z.string(),

    /**
     * The wallet type (`apple` or `google`).
     */
    type: z.enum(['apple', 'google']),

    /**
     * Why the push was sent.
     */
    reason: WalletUpdateReasonSchema,

    /**
     * Whether the push was acknowledged by the device.
     */
    acknowledged: z.boolean(),

    /**
     * Optional error message if the push failed.
     */
    error: z.string().nullable().optional(),

    /**
     * The date the push was sent.
     */
    createdDate: z.coerce.date(),
  })
  .passthrough();

/**
 * A push notification sent to an installed wallet.
 */
export type WalletUpdate = z.infer<typeof WalletUpdateSchema> & { reason: WalletUpdateReason };
