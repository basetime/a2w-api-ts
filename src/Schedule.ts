/**
 * The schedule when the campaign should run.
 */
export type ScheduleWhen = 'daily' | 'daily-except-weekends' | 'weekly' | 'monthly';

/**
 * The schedule for the campaign.
 */
export interface Schedule {
  /**
   * When the campaign should run.
   */
  when: ScheduleWhen | '';

  /**
   * The weekday the campaign should run.
   */
  weekday: string;

  /**
   * The monthday the campaign should run.
   */
  monthday: string;

  /**
   * The time the campaign should run.
   */
  time: string;
}
