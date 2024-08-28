/**
 * The stats for the campaign.
 */
export interface CampaignStats {
  /**
   * The total Mac devices.
   */
  countMacType: number;

  /**
   * The total Windows devices.
   */
  countWindowsType: number;

  /**
   * The total Linux devices.
   */
  countLinuxType: number;

  /**
   * The total mobile devices.
   */
  countMobileType: number;

  /**
   * The total desktop devices.
   */
  countDesktopType: number;

  /**
   * The total wearable devices.
   */
  countWearableType: number;

  /**
   * The total tablet devices.
   */
  countTabletType: number;

  /**
   * The total Android devices.
   */
  countAndroidType: number;

  /**
   * The total iOS devices.
   */
  countIOSType: number;

  /**
   * The total Windows Phone devices.
   */
  countWinPhoneType: number;
}

/**
 * The detailed stats for the campaign.
 */
export interface DetailedStats {
  /**
   * Hits per type of browser.
   */
  browsers: Record<string, number>;

  /**
   * Hits per country.
   */
  countries: Record<string, number>;

  /**
   * Hits per state.
   */
  states: Record<string, number>;

  /**
   * The total Mac devices.
   */
  countMacType: number;

  /**
   * The total Windows devices.
   */
  countWindowsType: number;

  /**
   * The total Linux devices.
   */
  countLinuxType: number;

  /**
   * The total mobile devices.
   */
  countMobileType: number;

  /**
   * The total desktop devices.
   */
  countDesktopType: number;

  /**
   * The total wearable devices.
   */
  countWearableType: number;

  /**
   * The total tablet devices.
   */
  countTabletType: number;

  /**
   * The total Android devices.
   */
  countAndroidType: number;

  /**
   * The total iOS devices.
   */
  countIOSType: number;

  /**
   * The total Windows Phone devices.
   */
  countWinPhoneType: number;

  /**
   * The total number of hits.
   */
  countTotal: number;
}

/**
 * The daily stats for the campaign.
 */
export interface DailyStats {
  [key: string]: DetailedStats;
}
