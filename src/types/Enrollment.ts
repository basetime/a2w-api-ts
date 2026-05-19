import { z } from 'zod';

/**
 * Schema for information about an enrollment.
 */
export const EnrollmentSchema = z
  .object({
    /**
     * The ID of the enrollment.
     */
    id: z.string(),

    /**
     * The user agent of the browser.
     */
    ui: z.string(),

    /**
     * The IP address of the user.
     */
    ip: z.string(),

    /**
     * The ID of the campaign the enrollment is for.
     */
    campaign: z.string(),

    /**
     * The primary data.
     */
    primaryKey: z.string(),

    /**
     * The submitted data.
     */
    submitted: z.record(z.string(), z.string()),
  })
  .passthrough();

/**
 * Information about an enrollment.
 */
export type Enrollment = z.infer<typeof EnrollmentSchema>;

/**
 * Schema for the response when creating an enrollment.
 */
export const EnrollmentResponseSchema = z
  .object({
    /**
     * The ID of the bundle that was created.
     */
    pass: z.string(),

    /**
     * Any errors that occurred.
     */
    errors: z.array(z.string()),
  })
  .passthrough();

/**
 * Response when creating an enrollment.
 */
export type EnrollmentResponse = z.infer<typeof EnrollmentResponseSchema>;
