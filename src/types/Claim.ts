/**
 * The details of a claimed pass.
 */
export interface Claim {
  /**
   * The ID of the log.
   */
  id: string;

  /**
   * The visitor's IP address.
   */
  ip: string;

  /**
   * The user agent string.
   */
  ua: string;

  /**
   * The URI the visitor requested.
   */
  uri: string;

  /**
   * The number of bytes in the response.
   */
  bytes: number;

  /**
   * The visitor's country.
   */
  country: string;

  /**
   * The visitor's state.
   */
  state: string;

  /**
   * The visitor's zip code.
   */
  zip: string;

  /**
   * The browser referrer.
   */
  referrer: string;

  /**
   * The visitor's latitude.
   */
  latitude: number;

  /**
   * The visitor's longitude.
   */
  longitude: number;

  /**
   * The query values passed to the requested page.
   */
  query: Record<string, string>;

  /**
   * The ID of the pass that was used.
   */
  pass: string;

  /**
   * The template ID.
   */
  templateId: string;

  /**
   * The template version.
   */
  templateVersion: number;

  /**
   * The ID of the enrollment if applicable.
   */
  enrollmentId: string;

  /**
   * The pass primary key value.
   */
  primaryKey: string;

  /**
   * The ID of the campaign.
   */
  campaign: string;

  /**
   * Was this a mobile request?
   */
  isMobile: boolean;

  /**
   * Was this a tablet request?
   */
  isTablet: boolean;

  /**
   * Was this a desktop request?
   */
  isDesktop: boolean;

  /**
   * Was this a wearable request?
   */
  isWearable: boolean;

  /**
   * Was this a Mac request?
   */
  isMacType: boolean;

  /**
   * Was this a Windows request?
   */
  isWindowsType: boolean;

  /**
   * Was this a Windows Phone request?
   */
  isWinPhoneType: boolean;

  /**
   * Was this an iOS request?
   */
  isIOSType: boolean;

  /**
   * Was this an Android request?
   */
  isAndroidType: boolean;

  /**
   * Was this a Linux request?
   */
  isLinuxType: boolean;

  /**
   * Information about the browser.
   */
  browser: {
    /**
     * The name of the browser.
     */
    name: string;

    /**
     * The version of the browser.
     */
    version: string;

    /**
     * The major version of the browser.
     */
    major: string;
  };

  /**
   * Information about the operating system.
   */
  os: {
    /**
     * The name of the operating system.
     */
    name: string;

    /**
     * The version of the operating system.
     */
    version: string;
  };

  /**
   * Was the pass installed?
   */
  installed: boolean;

  /**
   * Was the pass enrolled?
   */
  enrolled: boolean;

  /**
   * Was the pass pushed?
   */
  pushed: boolean;

  /**
   * Was the pass deleted?
   */
  deleted: boolean;

  /**
   * The date the pass was deleted from the user's wallet.
   *
   * If the pass is still in the user's wallet, this will be null.
   */
  deletedDate: Date | null;

  /**
   * The date the pass was updated in the user's wallet.
   *
   * If the pass has not been updated, this will be null.
   */
  updatedDate: Date | null;
}
