"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowMessageSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for a message logged during a workflow run.
 */
exports.WorkflowMessageSchema = zod_1.z
    .object({
    /**
     * The type of message.
     */
    type: zod_1.z.enum(['info', 'error', 'warn', 'marker-start', 'marker-end']),
    /**
     * The message to display.
     */
    message: zod_1.z.string(),
})
    .passthrough();
