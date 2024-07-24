import { Domain } from './Domain';
import { User } from './User';

/**
 * Represents an organization.
 */
export interface Organization {
  /**
   * The ID of the organization.
   */
  id: string;

  /**
   * The name of the organization.
   */
  name: string;

  /**
   * The URL of the logo.
   */
  logoUrl: string;

  /**
   * The domain of the organization.
   */
  domain: Domain | null;

  /**
   * The background color of the organization.
   */
  backgroundColor: string;

  /**
   * The URL of the favicon 16x16.
   */
  favIcon16: string;

  /**
   * The URL of the favicon 32x32.
   */
  favIcon32: string;

  /**
   * The URL of the favicon 48x48.
   */
  favIcon48: string;

  /**
   * The URL of the favicon 120x120.
   */
  favIcon120: string;

  /**
   * The URL of the favicon 240x240.
   */
  favIcon240: string;

  /**
   * The default proximity UUID.
   */
  defaultProximityUUID: string;

  /**
   * The URL to the terms page, not actually the html!
   */
  termsHtml: string;

  /**
   * The URL to the privacy page, not actually the html!
   */
  privacyHtml: string;

  /**
   * The code to add to every page related to the organization.
   */
  headerPixels?: string;

  /**
   * The code to add to every page related to the organization.
   */
  footerPixels?: string;

  /**
   * The ID of the owner of the organization.
   */
  owner: string;

  /**
   * The owner of the organization.
   */
  ownerUser?: User;

  /**
   * The IDs of the admins in the organization.
   */
  admins: string[];

  /**
   * The IDs of the editors in the organization.
   */
  editors: string[];

  /**
   * The join code for the organization.
   */
  joinCode: string;
}
