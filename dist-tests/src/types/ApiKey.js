"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeySchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for an API key.
 */
exports.ApiKeySchema = zod_1.z
    .object({
    /**
     * The ID of the API key.
     */
    id: zod_1.z.string(),
    /**
     * The user supplied name of the API key.
     */
    name: zod_1.z.string(),
    /**
     * A random string that is used to authenticate the API key.
     */
    key: zod_1.z.string(),
    /**
     * A random string that is used to authenticate the API key.
     */
    secret: zod_1.z.string(),
    /**
     * The ID of the organization the API key belongs to.
     */
    organizationId: zod_1.z.string(),
    /**
     * The ID of the scanner app the API key belongs to.
     */
    scannerApp: zod_1.z.string().optional(),
    /**
     * Whether this API key belongs to a scanner.
     */
    isScanner: zod_1.z.boolean().optional(),
    /**
     * Whether the API key has been deleted.
     */
    isDeleted: zod_1.z.boolean().optional(),
    /**
     * The date the API key was created.
     */
    createdDate: zod_1.z.coerce.date(),
})
    .passthrough();
