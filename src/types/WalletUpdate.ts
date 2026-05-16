/**
 * Why the wallet was pushed.
 *
 * Backend pushes are tagged with the reason they were created so consumers can filter the
 * log stream by intent. The set is expected to grow over time; new reasons are added on
 * the backend.
 */
export type WalletUpdateReason =
  | 'updatedPass'
  | 'updatedTemplate'
  | 'manualPush'
  | (string & {});

/**
 * A push notification sent to an installed wallet.
 *
 * Returned by `client.campaigns.wallets.getPushLogs(...)`.
 */
export interface WalletUpdate {
  /**
   * The ID of the wallet update.
   */
  id: string;

  /**
   * The campaign the update belongs to.
   */
  campaign: string;

  /**
   * The ID of the pass that was pushed.
   */
  pass: string;

  /**
   * The wallet type (`apple` or `google`).
   */
  type: 'apple' | 'google';

  /**
   * Why the push was sent.
   */
  reason: WalletUpdateReason;

  /**
   * Whether the push was acknowledged by the device.
   */
  acknowledged: boolean;

  /**
   * Optional error message if the push failed.
   */
  error?: string | null;

  /**
   * The date the push was sent.
   */
  createdDate: Date;
}
