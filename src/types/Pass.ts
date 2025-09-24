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
   * @deprecated Use the objectStore instead.
   */
  data: Record<string, string>;

  /**
   * The object store.
   */
  objectStore: Record<string, string | number | boolean | null>;

  /**
   * MD5 of the data for easier comparison.
   */
  dataMD5: string;

  /**
   * The value of the primary key in the data.
   */
  primaryKey: string;

  /**
   * The pass type identifier.
   */
  passTypeIdentifier: string;

  /**
   * The campaign the pass belongs to.
   */
  campaignId: string;

  /**
   * The organization the pass belongs to.
   */
  organizationId: string;

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
   * Whether the pass has been redeemed.
   */
  isRedeemed: boolean;

  /**
   * The date the pass was created
   */
  createdMillis?: number;

  /**
   * The date the pass was last updated.
   */
  updatedDate: Date;

  /**
   * The date the pass was created.
   */
  createdDate: Date;
}
