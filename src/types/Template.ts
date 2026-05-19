import { z } from 'zod';
import { GoogleTemplateSchema } from './GoogleTemplate';
import { OrganizationSchema } from './Organization';
import { UserSchema } from './User';

/**
 * Schema for the possible types of template attributes.
 */
export const TemplateAttributeTypeSchema = z.enum(['color', 'image', 'text', 'boolean']);

/**
 * The possible types of attributes.
 */
export type TemplateAttributeType = z.infer<typeof TemplateAttributeTypeSchema>;

/**
 * Schema for a single attribute of a template.
 */
export const TemplateAttributeSchema = z
  .object({
    /**
     * A unique key for the attribute.
     */
    key: z.string(),

    /**
     * The value of the attribute.
     */
    value: z.string(),

    /**
     * The type of the value.
     */
    type: TemplateAttributeTypeSchema,
  })
  .passthrough();

/**
 * A single attribute of a template.
 */
export type TemplateAttribute = z.infer<typeof TemplateAttributeSchema>;

/**
 * Schema for a list of attributes of a template.
 */
export const TemplateAttributesSchema = z.array(TemplateAttributeSchema);

/**
 * A list of attributes of a template.
 */
export type TemplateAttributes = z.infer<typeof TemplateAttributesSchema>;

/**
 * Schema for a template from which passes can be created.
 *
 * The `apple` field carries the Apple `PassProps` shape used by the
 * [`passkit-generator`](https://www.npmjs.com/package/passkit-generator) package, but
 * the SDK no longer takes a runtime dependency on that package. If you want strong
 * typing on `template.apple`, cast it: `template.apple as PassProps`.
 */
export const TemplateSchema = z
  .object({
    /**
     * The ID of the template.
     */
    id: z.string(),

    /**
     * The name of the template.
     */
    name: z.string(),

    /**
     * The version of the template.
     */
    version: z.number(),

    /**
     * The ID of the version in the database.
     */
    versionID: z.string(),

    /**
     * The files that are part of the template.
     */
    files: z.record(z.string(), z.string()),

    /**
     * The URLs of the files that are part of the template.
     */
    templateUrls: z.record(z.string(), z.string()),

    /**
     * The attributes of the template.
     */
    attributes: TemplateAttributesSchema,

    /**
     * Values related to the Apple version of the template. Shape matches
     * `passkit-generator`'s `PassProps`; consumers needing strong typing should cast.
     */
    apple: z.record(z.string(), z.unknown()),

    /**
     * Values related to the Google version of the template.
     */
    google: GoogleTemplateSchema,

    /**
     * Value that should be used instead of Apple's relevantDate.
     *
     * The relevantDate field is a Date object, but sometimes users need to put
     * {{placeholders}} in the value. This field allows them to do that.
     */
    relevantDateOverride: z.string().optional(),

    /**
     * Value that should be used instead of Apple's expirationDate.
     *
     * The expirationDate field is a Date object, but sometimes users need to put
     * {{placeholders}} in the value. This field allows them to do that.
     */
    expirationDateOverride: z.string().optional(),

    /**
     * The organization the template belongs to.
     */
    organization: OrganizationSchema,

    /**
     * The ID of the folder the template belongs to.
     */
    folder: z.string(),

    /**
     * Unique value that identifies the editing session the template was created in.
     */
    sessionId: z.string(),

    /**
     * The URL of the screenshot for the template.
     */
    screenshotUrl: z.string().optional(),

    /**
     * The URL of the Apple screenshot for the template.
     */
    screenshotAppleUrl: z.string().optional(),

    /**
     * The URL of the Android screenshot for the template.
     */
    screenshotAndroidUrl: z.string().optional(),

    /**
     * The URL of the PDF for the template.
     */
    pdfUrl: z.string().optional(),

    /**
     * The URL of the Apple PDF for the template.
     */
    pdfAppleUrl: z.string().optional(),

    /**
     * The URL of the Android PDF for the template.
     */
    pdfAndroidUrl: z.string().optional(),

    /**
     * The date the template was updated.
     */
    updatedDate: z.coerce.date(),

    /**
     * Is the public allowed to view the template?
     *
     * This value comes from the meta, and gets set on the object during transform.
     */
    isPublicShare: z.boolean(),

    /**
     * The current status (e.g. "Ready", "Working", "Review", "Done") of the template.
     *
     * This value comes from the meta, and gets set on the object during transform.
     */
    status: z.string(),

    /**
     * The user the template is assigned to.
     *
     * This value comes from the meta, and gets set on the object during transform.
     */
    assignee: UserSchema.nullable().optional(),

    /**
     * The user that created the template.
     *
     * This value comes from the meta, and gets set on the object during transform.
     */
    createdBy: UserSchema.nullable().optional(),

    /**
     * List of labels applied to the template.
     *
     * This value comes from the meta, and gets set on the object during transform.
     */
    labels: z.array(z.string()).nullable().optional(),
  })
  .passthrough();

/**
 * Represents a template from which passes can be created.
 */
export type Template = z.infer<typeof TemplateSchema>;
