"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnippetLibrarySchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for a snippet library.
 */
exports.SnippetLibrarySchema = zod_1.z
    .object({
    /**
     * The snippet library ID.
     */
    id: zod_1.z.string(),
    /**
     * The name of the snippet library.
     */
    name: zod_1.z.string(),
    /**
     * The description of the snippet library.
     */
    description: zod_1.z.string(),
    /**
     * The value of the snippet library.
     */
    code: zod_1.z.string(),
    /**
     * The packages to install.
     *
     * This is a list of NPM package names in the form of `package-name@version`.
     */
    packages: zod_1.z.array(zod_1.z.string()),
    /**
     * The organization that owns the snippet library.
     */
    organization: zod_1.z.string(),
})
    .passthrough();
