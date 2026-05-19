import { z } from 'zod';

/**
 * Schema for the schedule when the campaign should run.
 */
export const ScheduleWhenSchema = z.enum([
  'daily',
  'daily-except-weekends',
  'weekly',
  'monthly',
]);

/**
 * The schedule when the campaign should run.
 */
export type ScheduleWhen = z.infer<typeof ScheduleWhenSchema>;

/**
 * Schema for the schedule for the campaign.
 */
export const ScheduleSchema = z
  .object({
    /**
     * When the campaign should run.
     */
    when: z.union([ScheduleWhenSchema, z.literal('')]),

    /**
     * The weekday the campaign should run.
     */
    weekday: z.string(),

    /**
     * The monthday the campaign should run.
     */
    monthday: z.string(),

    /**
     * The time the campaign should run.
     */
    time: z.string(),
  })
  .passthrough();

/**
 * The schedule for the campaign.
 */
export type Schedule = z.infer<typeof ScheduleSchema>;
