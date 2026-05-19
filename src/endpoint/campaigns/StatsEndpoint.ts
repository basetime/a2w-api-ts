import { CampaignStats, CampaignStatsSchema } from '../../types/CampaignStats';
import Endpoint from '../Endpoint';

/**
 * Communicate with the `/campaigns/:campaignId/stats` sub-endpoint.
 *
 * Accessed via `client.campaigns.stats`.
 */
export default class CampaignStatsEndpoint extends Endpoint {
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
   * Returns statistics for a campaign.
   *
   * @param campaignId The ID of the campaign.
   * @returns The statistics.
   */
  public get = async (campaignId: string): Promise<CampaignStats> => {
    return await this.do.get(`/${campaignId}/stats`, CampaignStatsSchema);
  };
}
