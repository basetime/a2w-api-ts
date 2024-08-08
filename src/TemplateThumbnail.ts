/**
 * The details needed to render a template thumbnail.
 */
export interface TemplateThumbnail {
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
   * URL of the png thumbnail for the template.
   */
  thumbnail: string;

  /**
   * The logo URL for the template.
   */
  logo: string;

  /**
   * The banner URL for the template.
   */
  banner: string;

  /**
   * The background color of the template.
   */
  backgroundColor: string;

  /**
   * The foreground color of the template.
   */
  foregroundColor: string;

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
   * The date the template was created.
   */
  createdDate: Date;
}
