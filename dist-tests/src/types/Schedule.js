"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleSchema = exports.ScheduleWhenSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for the schedule when the campaign should run.
 */
exports.ScheduleWhenSchema = zod_1.z.enum([
    'daily',
    'daily-except-weekends',
    'weekly',
    'monthly',
]);
/**
 * Schema for the schedule for the campaign.
 */
exports.ScheduleSchema = zod_1.z
    .object({
    /**
     * When the campaign should run.
     */
    when: zod_1.z.union([exports.ScheduleWhenSchema, zod_1.z.literal('')]),
    /**
     * The weekday the campaign should run.
     */
    weekday: zod_1.z.string(),
    /**
     * The monthday the campaign should run.
     */
    monthday: zod_1.z.string(),
    /**
     * The time the campaign should run.
     */
    time: zod_1.z.string(),
})
    .passthrough();
