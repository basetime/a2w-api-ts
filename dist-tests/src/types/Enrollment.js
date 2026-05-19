"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentResponseSchema = exports.EnrollmentSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for information about an enrollment.
 */
exports.EnrollmentSchema = zod_1.z
    .object({
    /**
     * The ID of the enrollment.
     */
    id: zod_1.z.string(),
    /**
     * The user agent of the browser.
     */
    ui: zod_1.z.string(),
    /**
     * The IP address of the user.
     */
    ip: zod_1.z.string(),
    /**
     * The ID of the campaign the enrollment is for.
     */
    campaign: zod_1.z.string(),
    /**
     * The primary data.
     */
    primaryKey: zod_1.z.string(),
    /**
     * The submitted data.
     */
    submitted: zod_1.z.record(zod_1.z.string(), zod_1.z.string()),
})
    .passthrough();
/**
 * Schema for the response when creating an enrollment.
 */
exports.EnrollmentResponseSchema = zod_1.z
    .object({
    /**
     * The ID of the bundle that was created.
     */
    pass: zod_1.z.string(),
    /**
     * Any errors that occurred.
     */
    errors: zod_1.z.array(zod_1.z.string()),
})
    .passthrough();
