import type { PassProps } from 'passkit-generator';
import { GoogleTemplate } from '../types/GoogleTemplate';
import { Organization } from '../types/Organization';
import { User } from './User';

/**
 * Represents a template from which passes can be created.
 */
export interface Template {
  /**
   * The ID of the template.
   */
  id: string;

  /**
   * The name of the template.
   */
  name: string;

  /**
   * The version of the template.
   */
  version: number;

  /**
   * The ID of the version in the database.
   */
  versionID: string;

  /**
   * The files that are part of the template.
   */
  files: Record<string, string>;

  /**
   * The URLs of the files that are part of the template.
   */
  templateUrls: Record<string, string>;

  /**
   * Values related to the Apple version of the template.
   */
  apple: PassProps;

  /**
   * Values related to the Google version of the template.
   */
  google: GoogleTemplate;

  /**
   * Value that should be used instead of Apple's relevantDate.
   *
   * The relevantDate field is a Date object, but sometimes users need to put
   * {{placeholders}} in the value. This field allows them to do that.
   */
  relevantDateOverride?: string;

  /**
   * Value that should be used instead of Apple's expirationDate.
   *
   * The expirationDate field is a Date object, but sometimes users need to put
   * {{placeholders}} in the value. This field allows them to do that.
   */
  expirationDateOverride?: string;

  /**
   * The organization the template belongs to.
   */
  organization: Organization;

  /**
   * The ID of the folder the template belongs to.
   */
  folder: string;

  /**
   * Unique value that identifies the editing session the template was created in.
   */
  sessionId: string;

  /**
   * The URL of the screenshot for the template.
   */
  screenshotUrl?: string;

  /**
   * The URL of the Apple screenshot for the template.
   */
  screenshotAppleUrl?: string;

  /**
   * The URL of the Android screenshot for the template.
   */
  screenshotAndroidUrl?: string;

  /**
   * The URL of the PDF for the template.
   */
  pdfUrl?: string;

  /**
   * The URL of the Apple PDF for the template.
   */
  pdfAppleUrl?: string;

  /**
   * The URL of the Android PDF for the template.
   */
  pdfAndroidUrl?: string;

  /**
   * The date the template was updated.
   */
  updatedDate: Date;

  /**
   * Is the public allowed to view the template?
   *
   * This value comes from the meta, and gets set on the object during transform.
   */
  isPublicShare: boolean;

  /**
   * The current status (e.g. "Ready", "Working", "Review", "Done") of the template.
   *
   * This value comes from the meta, and gets set on the object during transform.
   */
  status: string;

  /**
   * The user the template is assigned to.
   *
   * This value comes from the meta, and gets set on the object during transform.
   */
  assignee?: User | null;

  /**
   * The user that created the template.
   *
   * This value comes from the meta, and gets set on the object during transform.
   */
  createdBy?: User | null;

  /**
   * List of labels applied to the template.
   *
   * This value comes from the meta, and gets set on the object during transform.
   */
  labels?: string[] | null;
}
