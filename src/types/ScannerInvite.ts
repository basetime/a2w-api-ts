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
  secret: string;

  /**
   * The security code used to verify the scanner.
   */
  verificationCode: string;

  /**
   * Has the invite been claimed?
   */
  isClaimed: boolean;

  /**
   * The pin number used to verify the scanner.
   */
  pin: string;

  /**
   * The brand color.
   */
  brandColor: string;

  /**
   * The brand logo url.
   */
  brandLogoUrl: string;

  /**
   * Whether or not to show the scanner button.
   */
  hideScanButton: boolean;

  /**
   * The webview url.
   */
  webviewUrl: string;

  /**
   * The webview jwt.
   */
  webviewJwt: string;

  /**
   * The date the invite was created.
   */
  createdDate: Date;
}
