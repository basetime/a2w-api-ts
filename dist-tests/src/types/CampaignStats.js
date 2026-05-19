"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyStatsSchema = exports.DetailedStatsSchema = exports.CampaignStatsSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for the stats for the campaign.
 */
exports.CampaignStatsSchema = zod_1.z
    .object({
    /**
     * The total Mac devices.
     */
    countMacType: zod_1.z.number(),
    /**
     * The total Windows devices.
     */
    countWindowsType: zod_1.z.number(),
    /**
     * The total Linux devices.
     */
    countLinuxType: zod_1.z.number(),
    /**
     * The total mobile devices.
     */
    countMobileType: zod_1.z.number(),
    /**
     * The total desktop devices.
     */
    countDesktopType: zod_1.z.number(),
    /**
     * The total wearable devices.
     */
    countWearableType: zod_1.z.number(),
    /**
     * The total tablet devices.
     */
    countTabletType: zod_1.z.number(),
    /**
     * The total Android devices.
     */
    countAndroidType: zod_1.z.number(),
    /**
     * The total iOS devices.
     */
    countIOSType: zod_1.z.number(),
    /**
     * The total Windows Phone devices.
     */
    countWinPhoneType: zod_1.z.number(),
})
    .passthrough();
/**
 * Schema for the detailed stats for the campaign.
 */
exports.DetailedStatsSchema = exports.CampaignStatsSchema.extend({
    /**
     * Hits per type of browser.
     */
    browsers: zod_1.z.record(zod_1.z.string(), zod_1.z.number()),
    /**
     * Hits per country.
     */
    countries: zod_1.z.record(zod_1.z.string(), zod_1.z.number()),
    /**
     * Hits per state.
     */
    states: zod_1.z.record(zod_1.z.string(), zod_1.z.number()),
    /**
     * The total number of hits.
     */
    countTotal: zod_1.z.number(),
}).passthrough();
/**
 * Schema for the daily stats for the campaign.
 */
exports.DailyStatsSchema = zod_1.z.record(zod_1.z.string(), exports.DetailedStatsSchema);
