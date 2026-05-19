"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScannerLogSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for a scanner log entry recorded against a pass.
 *
 * Returned by `client.campaigns.passes.getScannerLogs(...)`. The exact set of fields is
 * defined on the backend and may grow over time; consult the backend repo (`scanners`
 * and `campaigns/passes` route handlers) for the canonical shape.
 */
exports.ScannerLogSchema = zod_1.z
    .object({
    /**
     * The ID of the log entry.
     */
    id: zod_1.z.string(),
    /**
     * The ID of the API key the scan was made with.
     */
    apiKey: zod_1.z.string(),
    /**
     * The ID of the pass that was scanned.
     */
    pass: zod_1.z.string(),
    /**
     * The ID of the campaign the pass belongs to.
     */
    campaign: zod_1.z.string(),
    /**
     * Arbitrary scanner-supplied data captured at scan time.
     */
    data: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()),
    /**
     * The date the scan was recorded.
     */
    createdDate: zod_1.z.coerce.date(),
})
    .passthrough();
