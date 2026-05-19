import { z } from 'zod';

/**
 * Schema for the stats for the campaign.
 */
export const CampaignStatsSchema = z
  .object({
    /**
     * The total Mac devices.
     */
    countMacType: z.number(),

    /**
     * The total Windows devices.
     */
    countWindowsType: z.number(),

    /**
     * The total Linux devices.
     */
    countLinuxType: z.number(),

    /**
     * The total mobile devices.
     */
    countMobileType: z.number(),

    /**
     * The total desktop devices.
     */
    countDesktopType: z.number(),

    /**
     * The total wearable devices.
     */
    countWearableType: z.number(),

    /**
     * The total tablet devices.
     */
    countTabletType: z.number(),

    /**
     * The total Android devices.
     */
    countAndroidType: z.number(),

    /**
     * The total iOS devices.
     */
    countIOSType: z.number(),

    /**
     * The total Windows Phone devices.
     */
    countWinPhoneType: z.number(),
  })
  .passthrough();

/**
 * The stats for the campaign.
 */
export type CampaignStats = z.infer<typeof CampaignStatsSchema>;

/**
 * Schema for the detailed stats for the campaign.
 */
export const DetailedStatsSchema = CampaignStatsSchema.extend({
  /**
   * Hits per type of browser.
   */
  browsers: z.record(z.string(), z.number()),

  /**
   * Hits per country.
   */
  countries: z.record(z.string(), z.number()),

  /**
   * Hits per state.
   */
  states: z.record(z.string(), z.number()),

  /**
   * The total number of hits.
   */
  countTotal: z.number(),
}).passthrough();

/**
 * The detailed stats for the campaign.
 */
export type DetailedStats = z.infer<typeof DetailedStatsSchema>;

/**
 * Schema for the daily stats for the campaign.
 */
export const DailyStatsSchema = z.record(z.string(), DetailedStatsSchema);

/**
 * The daily stats for the campaign.
 */
export type DailyStats = z.infer<typeof DailyStatsSchema>;
