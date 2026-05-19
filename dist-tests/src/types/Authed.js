"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthedSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for an auth response from `/auth/apiGrant`, `/auth/oauth/token`, and
 * `/auth/apiRefresh`.
 */
exports.AuthedSchema = zod_1.z
    .object({
    /**
     * The ID token used as the bearer token on subsequent API requests.
     */
    idToken: zod_1.z.string(),
    /**
     * The refresh token used to obtain a fresh `idToken` without re-running the
     * full grant flow.
     */
    refreshToken: zod_1.z.string(),
    /**
     * Unix timestamp (in seconds) at which `idToken` expires.
     */
    expiresAt: zod_1.z.number(),
})
    .passthrough();
