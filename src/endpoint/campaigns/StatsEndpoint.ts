import { Requester } from '../../http/Requester';
import { CampaignStats } from '../../types/CampaignStats';
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
   * @param req The object to use to make requests.
   */
  constructor(req: Requester) {
    super(req, '/campaigns');
  }

  /**
   * Returns statistics for a campaign.
   *
   * @param campaignId The ID of the campaign.
   * @returns The statistics.
   */
  public get = async (campaignId: string): Promise<CampaignStats> => {
    return await this.do.get(`/${campaignId}/stats`);
  };
}
