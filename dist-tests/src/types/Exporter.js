"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExporterSchema = exports.ExporterInputSchema = exports.ExporterSourceSchema = exports.ExporterWhenSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for the recurrence schedule of an exporter run.
 */
exports.ExporterWhenSchema = zod_1.z.string();
/**
 * Schema for the connection type used by an exporter.
 */
exports.ExporterSourceSchema = zod_1.z.string();
/**
 * Schema for the body accepted by create/update on the exporters sub-endpoint.
 */
exports.ExporterInputSchema = zod_1.z
    .object({
    /**
     * Human-readable name shown in the dashboard.
     */
    name: zod_1.z.string(),
    /**
     * What is being exported (e.g. `enrollments`, `claims`).
     */
    what: zod_1.z.string(),
    /**
     * When the export should run.
     */
    when: exports.ExporterWhenSchema,
    /**
     * The day of the week the export should run (when {@link when} is `weekly`).
     */
    weekday: zod_1.z.string().optional(),
    /**
     * The day of the month the export should run (when {@link when} is `monthly`).
     */
    monthday: zod_1.z.string().optional(),
    /**
     * The time of day the export should run, in `HH:mm` form.
     */
    time: zod_1.z.string(),
    /**
     * The connection type.
     */
    source: exports.ExporterSourceSchema,
    /**
     * Source-specific configuration. Shape depends on {@link source}.
     */
    config: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()),
    /**
     * Email addresses to notify when the export completes, as a comma-separated string.
     */
    notifications: zod_1.z.string().optional(),
    /**
     * Encryption type (e.g. `pgp`).
     */
    encryption: zod_1.z.string().optional(),
    /**
     * Encryption key, when {@link encryption} is set.
     *
     * For PGP, must begin with `-----BEGIN PGP PUBLIC KEY BLOCK-----`.
     */
    encryptionKey: zod_1.z.string().optional(),
})
    .passthrough();
/**
 * Schema for an exporter configured on an organization.
 */
exports.ExporterSchema = exports.ExporterInputSchema.extend({
    /**
     * The ID of the exporter.
     */
    id: zod_1.z.string(),
    /**
     * The ID of the organization that owns the exporter.
     */
    organization: zod_1.z.string(),
    /**
     * The date the exporter was created.
     */
    createdDate: zod_1.z.coerce.date(),
}).passthrough();
