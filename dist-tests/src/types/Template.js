"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateSchema = exports.TemplateAttributesSchema = exports.TemplateAttributeSchema = exports.TemplateAttributeTypeSchema = void 0;
const zod_1 = require("zod");
const GoogleTemplate_1 = require("./GoogleTemplate");
const Organization_1 = require("./Organization");
const User_1 = require("./User");
/**
 * Schema for the possible types of template attributes.
 */
exports.TemplateAttributeTypeSchema = zod_1.z.enum(['color', 'image', 'text', 'boolean']);
/**
 * Schema for a single attribute of a template.
 */
exports.TemplateAttributeSchema = zod_1.z
    .object({
    /**
     * A unique key for the attribute.
     */
    key: zod_1.z.string(),
    /**
     * The value of the attribute.
     */
    value: zod_1.z.string(),
    /**
     * The type of the value.
     */
    type: exports.TemplateAttributeTypeSchema,
})
    .passthrough();
/**
 * Schema for a list of attributes of a template.
 */
exports.TemplateAttributesSchema = zod_1.z.array(exports.TemplateAttributeSchema);
/**
 * Schema for a template from which passes can be created.
 *
 * The `apple` field carries the Apple `PassProps` shape used by the
 * [`passkit-generator`](https://www.npmjs.com/package/passkit-generator) package, but
 * the SDK no longer takes a runtime dependency on that package. If you want strong
 * typing on `template.apple`, cast it: `template.apple as PassProps`.
 */
exports.TemplateSchema = zod_1.z
    .object({
    /**
     * The ID of the template.
     */
    id: zod_1.z.string(),
    /**
     * The name of the template.
     */
    name: zod_1.z.string(),
    /**
     * The version of the template.
     */
    version: zod_1.z.number(),
    /**
     * The ID of the version in the database.
     */
    versionID: zod_1.z.string(),
    /**
     * The files that are part of the template.
     */
    files: zod_1.z.record(zod_1.z.string(), zod_1.z.string()),
    /**
     * The URLs of the files that are part of the template.
     */
    templateUrls: zod_1.z.record(zod_1.z.string(), zod_1.z.string()),
    /**
     * The attributes of the template.
     */
    attributes: exports.TemplateAttributesSchema,
    /**
     * Values related to the Apple version of the template. Shape matches
     * `passkit-generator`'s `PassProps`; consumers needing strong typing should cast.
     */
    apple: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()),
    /**
     * Values related to the Google version of the template.
     */
    google: GoogleTemplate_1.GoogleTemplateSchema,
    /**
     * Value that should be used instead of Apple's relevantDate.
     *
     * The relevantDate field is a Date object, but sometimes users need to put
     * {{placeholders}} in the value. This field allows them to do that.
     */
    relevantDateOverride: zod_1.z.string().optional(),
    /**
     * Value that should be used instead of Apple's expirationDate.
     *
     * The expirationDate field is a Date object, but sometimes users need to put
     * {{placeholders}} in the value. This field allows them to do that.
     */
    expirationDateOverride: zod_1.z.string().optional(),
    /**
     * The organization the template belongs to.
     */
    organization: Organization_1.OrganizationSchema,
    /**
     * The ID of the folder the template belongs to.
     */
    folder: zod_1.z.string(),
    /**
     * Unique value that identifies the editing session the template was created in.
     */
    sessionId: zod_1.z.string(),
    /**
     * The URL of the screenshot for the template.
     */
    screenshotUrl: zod_1.z.string().optional(),
    /**
     * The URL of the Apple screenshot for the template.
     */
    screenshotAppleUrl: zod_1.z.string().optional(),
    /**
     * The URL of the Android screenshot for the template.
     */
    screenshotAndroidUrl: zod_1.z.string().optional(),
    /**
     * The URL of the PDF for the template.
     */
    pdfUrl: zod_1.z.string().optional(),
    /**
     * The URL of the Apple PDF for the template.
     */
    pdfAppleUrl: zod_1.z.string().optional(),
    /**
     * The URL of the Android PDF for the template.
     */
    pdfAndroidUrl: zod_1.z.string().optional(),
    /**
     * The date the template was updated.
     */
    updatedDate: zod_1.z.coerce.date(),
    /**
     * Is the public allowed to view the template?
     *
     * This value comes from the meta, and gets set on the object during transform.
     */
    isPublicShare: zod_1.z.boolean(),
    /**
     * The current status (e.g. "Ready", "Working", "Review", "Done") of the template.
     *
     * This value comes from the meta, and gets set on the object during transform.
     */
    status: zod_1.z.string(),
    /**
     * The user the template is assigned to.
     *
     * This value comes from the meta, and gets set on the object during transform.
     */
    assignee: User_1.UserSchema.nullable().optional(),
    /**
     * The user that created the template.
     *
     * This value comes from the meta, and gets set on the object during transform.
     */
    createdBy: User_1.UserSchema.nullable().optional(),
    /**
     * List of labels applied to the template.
     *
     * This value comes from the meta, and gets set on the object during transform.
     */
    labels: zod_1.z.array(zod_1.z.string()).nullable().optional(),
})
    .passthrough();
