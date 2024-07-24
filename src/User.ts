/**
 * Represents a user.
 */
export interface User {
  /**
   * The ID of the user.
   */
  id: string;

  /**
   * The display name of the user.
   */
  displayName: string;

  /**
   * The email address of the user.
   */
  email: string;

  /**
   * The avatar URL of the user.
   */
  photoURL: string;

  /**
   * The color of the user's avatar.
   */
  avatarColor: string;

  /**
   * The organizations the user belongs to.
   */
  organizations: string[];

  /**
   * The display names of the organizations the user belongs to.
   */
  clientsDisplay: string[];

  /**
   * The date the user last logged in.
   */
  dateLastLogin: Date;
}
