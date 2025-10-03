/**
 * Represents an image that can be used on the frontend.
 */
export interface Image {
  /**
   * The name of the image.
   */
  name: string;

  /**
   * The URL of the image.
   */
  url: string;

  /**
   * The tags associated with the image.
   */
  tags: string[];

  /**
   * The width of the image.
   */
  width: number;

  /**
   * The height of the image.
   */
  height: number;

  /**
   * The size of the image in bytes.
   */
  size: number;

  /**
   * The mime type of the image.
   */
  mimeType: string;

  /**
   * The md5 hash of the image.
   */
  md5: string;

  /**
   * The ID of the folder the template belongs to.
   */
  folder: string;
}
