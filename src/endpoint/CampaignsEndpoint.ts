import { z } from 'zod';
import { Requester } from '../http/Requester';
import { Campaign, CampaignSchema } from '../types/Campaign';
import CampaignClaimsEndpoint from './campaigns/ClaimsEndpoint';
import CampaignEnrollmentsEndpoint from './campaigns/EnrollmentsEndpoint';
import CampaignJobsEndpoint from './campaigns/JobsEndpoint';
import CampaignPassesEndpoint from './campaigns/PassesEndpoint';
import CampaignStatsEndpoint from './campaigns/StatsEndpoint';
import CampaignWalletsEndpoint from './campaigns/WalletsEndpoint';
import CampaignWorkflowsEndpoint from './campaigns/WorkflowsEndpoint';
import Endpoint from './Endpoint';

/**
 * Communicate with the campaigns endpoints.
 *
 * Top-level methods (`getAll`, `getById`) operate on the campaign collection itself. Per-campaign
 * sub-resources are grouped into dedicated sub-endpoints exposed as `public readonly` props,
 * mirroring the composition pattern of {@link ../Client | Client}.
 *
 * The sub-endpoints reuse this parent's `req`, `do`, and `qb` (via `super(parent)`) rather
 * than each constructing their own `EndpointDo`/`QueryBuilder` rooted at `/campaigns`.
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
   * Wallet management for a campaign (`/campaigns/:campaignId/wallets/*`).
   *
   * Lists installed wallets, fetches per-pass push logs, triggers template-driven pushes,
   * and dismisses pending push notices.
   */
  public readonly wallets: CampaignWalletsEndpoint;

  /**
   * Workflow attachments for a campaign (`/campaigns/:campaignId/workflows/*`).
   *
   * Lists, attaches, updates, and detaches workflows on a campaign. The workflows themselves
   * are managed via {@link ../WorkflowsEndpoint | WorkflowsEndpoint}.
   */
  public readonly workflows: CampaignWorkflowsEndpoint;

  /**
   * Constructor.
   *
   * @param req The object to use to make requests.
   */
  constructor(req: Requester) {
    super(req, '/campaigns');
    this.passes = new CampaignPassesEndpoint(this);
    this.claims = new CampaignClaimsEndpoint(this);
    this.jobs = new CampaignJobsEndpoint(this);
    this.stats = new CampaignStatsEndpoint(this);
    this.enrollments = new CampaignEnrollmentsEndpoint(this);
    this.wallets = new CampaignWalletsEndpoint(this);
    this.workflows = new CampaignWorkflowsEndpoint(this);
  }

  /**
   * Returns all of the campaigns for authenticated organization.
   *
   * @returns The campaigns.
   */
  public getAll = async (): Promise<Campaign[]> => {
    return await this.do.get('', z.array(CampaignSchema));
  };

  /**
   * Returns the details of a campaign.
   *
   * @param id The ID of the campaign.
   */
  public getById = async (id: string): Promise<Campaign> => {
    return await this.do.get(`/${id}`, CampaignSchema);
  };

  /**
   * Updates a campaign.
   *
   * Mirrors the backend Joi schema permissively as `Partial<Campaign>`; only fields
   * accepted by the backend will be applied. `templates` is overridden to accept a list of
   * template IDs (the wire format used by the update route), not the populated
   * {@link Template} array returned by reads.
   *
   * @param id The ID of the campaign.
   * @param body The campaign updates.
   */
  public update = async (
    id: string,
    body: Omit<Partial<Campaign>, 'templates'> & { templates?: string[] },
  ): Promise<Campaign> => {
    return await this.do.post(`/${id}`, body, CampaignSchema);
  };

  /**
   * Creates or updates a "simple" campaign from a template and placeholder values.
   *
   * Pass `'__new'` as the ID to create a new campaign; pass an existing campaign ID to
   * update one in place.
   *
   * @param id The campaign ID, or `'__new'` to create a new campaign.
   * @param body The simple campaign body.
   */
  public createSimple = async (
    id: string,
    body: {
      /**
       * Partial campaign fields applied to the new or existing campaign.
       */
      campaign: Partial<Campaign>;
      /**
       * The ID of the template whose layout placeholders should be filled.
       */
      templateId: string;
      /**
       * Values for each placeholder defined by the template's layout.
       */
      placeholders: Record<string, string>;
    },
  ): Promise<Campaign> => {
    return await this.do.post(`/${id}/simple`, body, CampaignSchema);
  };

  /**
   * Clones a campaign and returns the ID of the new campaign.
   *
   * @param id The ID of the campaign to clone.
   */
  public clone = async (id: string): Promise<string> => {
    return await this.do.post(`/${id}/clone`, {}, z.string());
  };

  /**
   * Deletes a campaign.
   *
   * @param id The ID of the campaign to delete.
   */
  public delete = async (id: string): Promise<string> => {
    return await this.do.del(`/${id}`, z.string());
  };
}
