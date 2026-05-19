"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExporterLogSchema = exports.ExporterLogStatusSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for the outcome of an exporter run.
 */
exports.ExporterLogStatusSchema = zod_1.z.string();
/**
 * Schema for a record of an exporter execution.
 *
 * Returned by `client.organizations.exporters.getLogs(...)` and `getLog(...)`.
 */
exports.ExporterLogSchema = zod_1.z
    .object({
    /**
     * The ID of the log entry.
     */
    id: zod_1.z.string(),
    /**
     * The ID of the organization that owns the exporter.
     */
    organization: zod_1.z.string(),
    /**
     * The ID of the exporter that ran.
     */
    exporter: zod_1.z.string(),
    /**
     * Outcome of the run.
     */
    status: exports.ExporterLogStatusSchema,
    /**
     * Human-readable message describing the result.
     */
    message: zod_1.z.string().optional(),
    /**
     * Error string, when {@link status} is `'error'`.
     */
    error: zod_1.z.string().nullable().optional(),
    /**
     * Number of rows exported.
     */
    rowCount: zod_1.z.number().optional(),
    /**
     * Number of seconds the run took.
     */
    runTime: zod_1.z.number().optional(),
    /**
     * The date the run started.
     */
    createdDate: zod_1.z.coerce.date(),
})
    .passthrough();
