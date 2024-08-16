/**
 * A scanner invite is a jwt that is used to authenticate with a scanner.
 */
export interface ScannerInvite {
  /**
   * The ID of the scanner invite.
   */
  id: string;

  /**
   * The organization the scanner invite belongs to.
   */
  organization: string;

  /**
   * The invite code.
   */
  code: string;

  /**
   * The security code used to verify the scanner.
   */
  securityCode: string;

  /**
   * Has the invite been claimed?
   */
  isClaimed: boolean;

  /**
   * The date the invite was created.
   */
  createdDate: Date;
}
