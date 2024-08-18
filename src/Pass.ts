import { Campaign } from './Campaign';

/**
 * Information needed to generate a pass.
 */
export interface Pass {
  /**
   * The pass ID.
   */
  id: string;

  /**
   * The ID of the bundle the pass belongs to.
   */
  bundle: string;

  /**
   * The ID of the job that created the pass.
   */
  jobId: string;

  /**
   * The serial number of the pass.
   *
   * The serial number is important to updating wallets.
   */
  serialNumber: string;

  /**
   * The data stored inside the pass.
   *
   * This data typically comes from a csv file.
   */
  data: Record<string, string>;

  /**
   * MD5 of the data for easier comparison.
   */
  dataMD5: string;

  /**
   * The value of the primary key in the data.
   */
  primaryKey: string;

  /**
   * The campaign the pass belongs to.
   */
  campaign: Campaign;

  /**
   * The template ID.
   */
  templateId: string;

  /**
   * The template version.
   */
  templateVersion: number;

  /**
   *
   */
  enrollment?: string;

  /**
   * The ID request log that claimed the pass.
   */
  requestLog: string;

  /**
   * The ID of the saved google object.
   */
  googleObjectId?: string;

  /**
   * Whether the pass has been claimed.
   */
  isClaimed: boolean;

  /**
   * Whether the pass has been scanned.
   */
  isScanned: boolean;

  /**
   * The date the pass was created
   */
  createdMillis?: number;

  /**
   * The date the pass was last updated.
   */
  updatedDate: Date;
}
