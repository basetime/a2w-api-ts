import Endpoint from './Endpoint';
import { Pass } from './Pass';

/**
 * Communicate with the campaigns endpoints.
 */
export default class CampaignsEndpoint extends Endpoint {
  /**
   * The endpoint.
   */
  public static readonly endpoint = '/campaigns';

  /**
   * Returns the passes for a campaign.
   *
   * @param campaignId The ID of the campaign.
   */
  public getPasses = async (campaignId: string): Promise<Pass[]> => {
    const url = `${CampaignsEndpoint.endpoint}/${campaignId}/passes`;

    return await this.req.do<Pass[]>(url, {
      method: 'GET',
    });
  };
}
