import { z } from 'zod';
import { Enrollment, EnrollmentSchema } from '../../types/Enrollment';
import { WalletUpdate, WalletUpdateSchema } from '../../types/WalletUpdate';
import Endpoint from '../Endpoint';

/**
 * Pagination options accepted by {@link CampaignWalletsEndpoint.getAll}.
 */
export interface CampaignWalletsPagination {
  /**
   * The page number to fetch (1-indexed).
   */
  page?: number;

  /**
   * The number of entries per page.
   */
  perPage?: number;
}

/**
 * Schema for the response returned by {@link CampaignWalletsEndpoint.getAll}.
 *
 * Mirrors the backend's wallet listing response: a map of bundle IDs to request logs, the
 * corresponding bundles, and pagination metadata.
 */
export const CampaignWalletsResponseSchema = z
  .object({
    /**
     * Request logs grouped by bundle ID.
     */
    bundled: z.record(z.string(), z.array(z.unknown())),

    /**
     * The bundle entities referenced by {@link bundled}.
     */
    bundles: z.array(z.unknown()),

    /**
     * The current page number.
     */
    page: z.number(),

    /**
     * The total number of items.
     */
    totalItems: z.number(),

    /**
     * The total number of pages.
     */
    totalPages: z.number(),
  })
  .passthrough();

/**
 * Response shape returned by {@link CampaignWalletsEndpoint.getAll}.
 */
export type CampaignWalletsResponse = z.infer<typeof CampaignWalletsResponseSchema>;

/**
 * Schema for the response returned by {@link CampaignWalletsEndpoint.getEnrollment}.
 */
export const CampaignWalletEnrollmentResponseSchema = z
  .object({
    /**
     * The campaign the enrollment belongs to.
     */
    campaign: z.unknown(),

    /**
     * The enrollment details.
     */
    enrollment: EnrollmentSchema.nullable(),
  })
  .passthrough();

/**
 * Response shape returned by {@link CampaignWalletsEndpoint.getEnrollment}.
 */
export type CampaignWalletEnrollmentResponse = {
  campaign: unknown;
  enrollment: Enrollment | null;
};

/**
 * Communicate with the `/campaigns/:campaignId/wallets/*` sub-endpoints.
 *
 * Accessed via `client.campaigns.wallets`. Lists installed wallets, fetches per-pass push
 * logs, triggers template-driven pushes, and dismisses pending push notices.
 */
export default class CampaignWalletsEndpoint extends Endpoint {
  /**
   * Constructor.
   *
   * @param parent The parent `CampaignsEndpoint` whose `req`, `do`, and `qb` are
   *   reused.
   */
  constructor(parent: Endpoint) {
    super(parent);
  }

  /**
   * Returns the wallets for a campaign, grouped by bundle.
   *
   * @param campaignId The ID of the campaign.
   * @param pagination Optional pagination overrides.
   */
  public getAll = async (
    campaignId: string,
    pagination: CampaignWalletsPagination = {},
  ): Promise<CampaignWalletsResponse> => {
    const url = this.qb.create('/{campaign}/wallets').addParam('campaign', campaignId);
    if (pagination.page !== undefined) {
      url.addQuery('page', pagination.page);
    }
    if (pagination.perPage !== undefined) {
      url.addQuery('perPage', pagination.perPage);
    }

    return await this.do.get(url, CampaignWalletsResponseSchema);
  };

  /**
   * Returns the details of a single wallet enrollment.
   *
   * @param campaignId The ID of the campaign.
   * @param enrollmentId The ID of the enrollment.
   */
  public getEnrollment = async (
    campaignId: string,
    enrollmentId: string,
  ): Promise<CampaignWalletEnrollmentResponse> => {
    return await this.do.get(
      `/${campaignId}/wallets/enrollments/${enrollmentId}`,
      CampaignWalletEnrollmentResponseSchema,
    );
  };

  /**
   * Returns the push log history for a specific pass.
   *
   * @param campaignId The ID of the campaign.
   * @param passId The ID of the pass.
   */
  public getPushLogs = async (
    campaignId: string,
    passId: string,
  ): Promise<WalletUpdate[]> => {
    return await this.do.get(
      `/${campaignId}/wallets/pushes/${passId}/logs`,
      z.array(WalletUpdateSchema),
    );
  };

  /**
   * Pushes template updates to every wallet that has the campaign's passes installed.
   *
   * Returns the number of passes that were queued for update.
   *
   * @param campaignId The ID of the campaign.
   * @param templateIds The IDs of the templates whose changes should be pushed.
   */
  public pushTemplates = async (
    campaignId: string,
    templateIds: string[],
  ): Promise<number> => {
    return await this.do.post(
      `/${campaignId}/wallets/pushes`,
      { templates: templateIds },
      z.number(),
    );
  };

  /**
   * Dismisses the "pending pushes" notice for a campaign without actually pushing.
   *
   * Advances each template's last-pushed version to the current version so the dashboard
   * stops nagging about unpushed changes.
   *
   * @param campaignId The ID of the campaign.
   */
  public dismissPushes = async (campaignId: string): Promise<string> => {
    return await this.do.del(`/${campaignId}/wallets/pushes`, z.string());
  };
}
