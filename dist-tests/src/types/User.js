"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for a user.
 */
exports.UserSchema = zod_1.z
    .object({
    /**
     * The ID of the user.
     */
    id: zod_1.z.string(),
    /**
     * The display name of the user.
     */
    displayName: zod_1.z.string(),
    /**
     * The email address of the user.
     */
    email: zod_1.z.string(),
    /**
     * The avatar URL of the user.
     */
    photoURL: zod_1.z.string(),
    /**
     * The color of the user's avatar.
     */
    avatarColor: zod_1.z.string(),
    /**
     * The organizations the user belongs to.
     */
    organizations: zod_1.z.array(zod_1.z.string()),
    /**
     * The display names of the organizations the user belongs to.
     */
    clientsDisplay: zod_1.z.array(zod_1.z.string()),
    /**
     * The date the user last logged in.
     */
    dateLastLogin: zod_1.z.coerce.date(),
})
    .passthrough();
