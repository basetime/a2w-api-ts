/**
 * Information about an enrollment.
 */
export interface Enrollment {
  /**
   * The ID of the enrollment.
   */
  id: string;

  /**
   * The user agent of the browser.
   */
  ui: string;

  /**
   * The IP address of the user.
   */
  ip: string;

  /**
   * The ID of the campaign the enrollment is for.
   */
  campaign: string;

  /**
   * The primary data.
   */
  primaryKey: string;

  /**
   * The submitted data.
   */
  submitted: Record<string, string>;
}
