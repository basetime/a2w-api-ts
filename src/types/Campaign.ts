import { CampaignStats } from './CampaignStats';
import { Organization } from './Organization';
import { Schedule } from './Schedule';
import { Template } from './Template';

/**
 * The details of a campaign.
 */
export interface Campaign {
  /**
   * The ID of the campaign.
   */
  id: string;

  /**
   * The name of the campaign.
   */
  name: string;

  /**
   * The organization that owns the campaign.
   */
  client: Organization;

  /**
   * The templates used by the campaign.
   */
  templates: Template[];

  /**
   * The ID of the landing page.
   */
  landingPage: string;

  /**
   * The name of the primary key to save from imported csv data.
   */
  primaryKey: string;

  /**
   * The tags associated with the campaign.
   */
  tags: string[];

  /**
   * The description of the campaign.
   */
  description: string;

  /**
   * Code added to the head of the claims page.
   */
  headerPixels?: string;

  /**
   * Code added to the footer of the claims page.
   */
  footerPixels?: string;

  /**
   * Is anyone allowed to join the campaign?
   */
  openEnrollment: boolean;

  /**
   * The ID of the landing page for open enrollment.
   */
  openEnrollmentLandingPage: string;

  /**
   * The permalink to the open enrollment page.
   */
  openEnrollmentPermalink: string;

  /**
   * The auto-submit jwt secret.
   *
   * The form values for open enrollment may be passed as query params. They may
   * also be passed as a JWT token. This secret is used to verify the signature
   * of the JWT token.
   */
  openEnrollmentJwtSecret: string;

  /**
   * The ID of the integration used to import data.
   */
  importDataSource: string;

  /**
   * The ID of the integration used to export data.
   */
  exportDataSource: string;

  /**
   * The configuration for the import integration.
   */
  importConfig: any;

  /**
   * The configuration for the export integration.
   */
  exportConfig: any;

  /**
   * Who (by email) should be notified when a job finishes?
   */
  jobNotifications: string;

  /**
   * The number of passes created by the campaign.
   */
  passesCount: number;

  /**
   * The number of passes claimed by the campaign.
   */
  claimedCount: number;

  /**
   * The number of wallets that registered.
   */
  registeredCount: number;

  /**
   * The number of enrollments.
   */
  enrolledCount: number;

  /**
   * Is the campaign deleted?
   */
  isDeleted: boolean;

  /**
   * The Apple pass type identifier, copied from the template.
   */
  passTypeIdentifier: string;

  /**
   * The Google issuer, copied from the template.
   */
  googleIssuer: string;

  /**
   * When the campaign launched, null if not running.
   */
  runningDate: Date | null;

  /**
   * The updatedDate value from the template the last time we pushed changes.
   */
  templateLastChangeDate: Date | null;

  /**
   * The current updatedDate value from the template.
   */
  templateCurrentChangeDate: Date | null;

  /**
   * The schedule for the campaign.
   */
  schedule?: Schedule;

  /**
   * The ID of the folder the campaign belongs to.
   */
  folder: string;

  /**
   * The stats for the campaign.
   */
  stats: CampaignStats;

  /**
   * The browsers that have accessed the campaign.
   */
  browsers: Record<string, number>;

  /**
   * The countries that have accessed the campaign.
   */
  countries: Record<string, number>;

  /**
   * The states that have accessed the campaign.
   */
  states: Record<string, number>;

  /**
   * The date the campaign was created.
   */
  createdDate: Date;
}
