import { Requester } from '../http/Requester';
import { Campaign } from '../types/Campaign';
import CampaignClaimsEndpoint from './campaigns/ClaimsEndpoint';
import CampaignEnrollmentsEndpoint from './campaigns/EnrollmentsEndpoint';
import CampaignJobsEndpoint from './campaigns/JobsEndpoint';
import CampaignPassesEndpoint from './campaigns/PassesEndpoint';
import CampaignStatsEndpoint from './campaigns/StatsEndpoint';
import Endpoint from './Endpoint';

/**
 * Communicate with the campaigns endpoints.
 *
 * Top-level methods (`getAll`, `getById`) operate on the campaign collection itself. Per-campaign
 * sub-resources are grouped into dedicated sub-endpoints exposed as `public readonly` props,
 * mirroring the composition pattern of {@link ../Client | Client}.
 */
export default class CampaignsEndpoint extends Endpoint {
  /**
   * Pass operations for a campaign (`/campaigns/:campaignId/passes/*`).
   *
   * CRUD on individual passes, bulk updates, queries, bundle creation, redemption, and logs.
   */
  public readonly passes: CampaignPassesEndpoint;

  /**
   * Claim listings for a campaign (`/campaigns/:campaignId/claims`).
   */
  public readonly claims: CampaignClaimsEndpoint;

  /**
   * Job listings for a campaign (`/campaigns/:campaignId/jobs`).
   */
  public readonly jobs: CampaignJobsEndpoint;

  /**
   * Statistics for a campaign (`/campaigns/:campaignId/stats`).
   */
  public readonly stats: CampaignStatsEndpoint;

  /**
   * Enrollment reads and writes for a campaign. Reads live under
   * `/campaigns/:campaignId/enrollments`; writes hit the unauthenticated `/e/campaign/:id` route.
   *
   * The `jwtEncode` hook (formerly on this class) lives on this sub-endpoint.
   */
  public readonly enrollments: CampaignEnrollmentsEndpoint;

  /**
   * Constructor.
   *
   * @param req The object to use to make requests.
   */
  constructor(req: Requester) {
    super(req, '/campaigns');
    this.passes = new CampaignPassesEndpoint(req);
    this.claims = new CampaignClaimsEndpoint(req);
    this.jobs = new CampaignJobsEndpoint(req);
    this.stats = new CampaignStatsEndpoint(req);
    this.enrollments = new CampaignEnrollmentsEndpoint(req);
  }

  /**
   * Returns all of the campaigns for authenticated organization.
   *
   * @returns The campaigns.
   */
  public getAll = async (): Promise<Campaign[]> => {
    return await this.do.get('');
  };

  /**
   * Returns the details of a campaign.
   *
   * @param id The ID of the campaign.
   */
  public getById = async (id: string): Promise<Campaign> => {
    return await this.do.get(`/${id}`);
  };
}
