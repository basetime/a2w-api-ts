"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleTemplateSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for the Google Wallet portion of a template.
 *
 * The backend only exposes the issuer ID on this object today; additional fields are
 * allowed via `passthrough()` so future server additions don't break consumers.
 */
exports.GoogleTemplateSchema = zod_1.z
    .object({
    /**
     * The Google issuer ID.
     */
    id: zod_1.z.string(),
})
    .passthrough();
