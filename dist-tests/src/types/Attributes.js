"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributesSchema = exports.AttributeItemSchema = exports.AttributeTypeSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for the possible types of attributes.
 */
exports.AttributeTypeSchema = zod_1.z.enum(['text', 'boolean', 'number']);
/**
 * Schema for a single attribute.
 */
exports.AttributeItemSchema = zod_1.z
    .object({
    /**
     * A unique key for the attribute.
     */
    key: zod_1.z.string(),
    /**
     * Description of the attribute.
     */
    description: zod_1.z.string(),
    /**
     * The value of the attribute.
     */
    value: zod_1.z.union([zod_1.z.string(), zod_1.z.boolean()]),
    /**
     * The type of the value.
     */
    type: exports.AttributeTypeSchema,
})
    .passthrough();
/**
 * Schema for an attribute collection.
 */
exports.AttributesSchema = zod_1.z
    .object({
    /**
     * The items of the attribute.
     */
    items: zod_1.z.array(exports.AttributeItemSchema),
})
    .passthrough();
