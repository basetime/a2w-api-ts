"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for a workflow.
 */
exports.WorkflowSchema = zod_1.z
    .object({
    /**
     * The workflow ID.
     */
    id: zod_1.z.string(),
    /**
     * The ID of the organization that owns the workflow.
     */
    organizationId: zod_1.z.string(),
    /**
     * The scanner app associated with the workflow.
     */
    scannerAppId: zod_1.z.string().nullable(),
    /**
     * The name of the workflow.
     */
    name: zod_1.z.string(),
    /**
     * The description of the workflow.
     */
    description: zod_1.z.string(),
    /**
     * The code to run.
     */
    code: zod_1.z.string(),
    /**
     * The packages to install.
     *
     * This is a list of NPM package names in the form of `package-name@version`.
     */
    packages: zod_1.z.array(zod_1.z.string()),
    /**
     * The date the workflow was created.
     */
    createdDate: zod_1.z.coerce.date(),
})
    .passthrough();
