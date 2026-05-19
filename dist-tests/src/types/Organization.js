"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationSchema = void 0;
const zod_1 = require("zod");
const Domain_1 = require("./Domain");
const User_1 = require("./User");
/**
 * Schema for an organization.
 */
exports.OrganizationSchema = zod_1.z
    .object({
    /**
     * The ID of the organization.
     */
    id: zod_1.z.string(),
    /**
     * The name of the organization.
     */
    name: zod_1.z.string(),
    /**
     * The URL of the logo.
     */
    logoUrl: zod_1.z.string(),
    /**
     * The domain of the organization.
     */
    domain: Domain_1.DomainSchema.nullable(),
    /**
     * The background color of the organization.
     */
    backgroundColor: zod_1.z.string(),
    /**
     * The URL of the favicon 16x16.
     */
    favIcon16: zod_1.z.string(),
    /**
     * The URL of the favicon 32x32.
     */
    favIcon32: zod_1.z.string(),
    /**
     * The URL of the favicon 48x48.
     */
    favIcon48: zod_1.z.string(),
    /**
     * The URL of the favicon 120x120.
     */
    favIcon120: zod_1.z.string(),
    /**
     * The URL of the favicon 240x240.
     */
    favIcon240: zod_1.z.string(),
    /**
     * The default proximity UUID.
     */
    defaultProximityUUID: zod_1.z.string(),
    /**
     * The URL to the terms page, not actually the html!
     */
    termsHtml: zod_1.z.string(),
    /**
     * The URL to the privacy page, not actually the html!
     */
    privacyHtml: zod_1.z.string(),
    /**
     * The code to add to every page related to the organization.
     */
    headerPixels: zod_1.z.string().optional(),
    /**
     * The code to add to every page related to the organization.
     */
    footerPixels: zod_1.z.string().optional(),
    /**
     * The ID of the owner of the organization.
     */
    owner: zod_1.z.string(),
    /**
     * The owner of the organization.
     */
    ownerUser: User_1.UserSchema.optional(),
    /**
     * The IDs of the admins in the organization.
     */
    admins: zod_1.z.array(zod_1.z.string()),
    /**
     * The IDs of the editors in the organization.
     */
    editors: zod_1.z.array(zod_1.z.string()),
    /**
     * The join code for the organization.
     */
    joinCode: zod_1.z.string(),
})
    .passthrough();
