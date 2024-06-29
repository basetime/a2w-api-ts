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
   * The password of the user.
   */
  password?: string;

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
   * Password recovery code.
   */
  recoverCode: string;

  /**
   * The date the user last logged in.
   */
  dateLastLogin: Date;

  /**
   * Which stages of the getting started guide has the user completed.
   */
  gettingStartedCompleted?: string[];

  /**
   * Whether the user is a site admin.
   */
  isSiteAdmin?: boolean;

  /**
   * The user's OTP secret.
   */
  siteAdminTOTP?: string;
}
